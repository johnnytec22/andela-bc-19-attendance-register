var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var firebase = require('firebase');

//my app
var app = express();


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDIqL445DR3OE_kinUxqGUBui-Uz87vRts",
    authDomain: "attendance-register-bb09b.firebaseapp.com",
    databaseURL: "https://attendance-register-bb09b.firebaseio.com",
    storageBucket: "attendance-register-bb09b.appspot.com",
    messagingSenderId: "676309710362"
};
firebase.initializeApp(config);

var register = firebase.database().ref('register');
//var registerKey = register.push().key;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//setting static path
app.use(express.static(path.join(__dirname, 'public')));

//Global vars
app.use(function(req, res, next){
	res.locals.error = null;
	res.locals.errors = null;
	next();

})
//validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));





//routing
app.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'e-Register' });
});




app.get('/view', function(req, res, next) {
	register = register.child('Events');
	register.on("value", function(snapshot) {
		var data = snapshot.val();
		res.render("attendanceDetailView.ejs", {views: data} );
	});
	
	}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});






app.post('/details', function(req, res, next){
	req.checkBody('eventname', 'Name field is required').notEmpty();
	req.checkBody('location', 'Location field is required').notEmpty();
	req.checkBody('firstname', 'First name is required').notEmpty();
	req.checkBody('lastname', 'Last name is required!').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('phone', 'Phone is required!').notEmpty();
	req.checkBody('address', 'Address is equired!').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		res.render('index', { 
		title: 'Registration',
		errors: errors });
	}else{
		var newUser = {
			event: req.body.eventname,
			date: req.body.date,
			location: req.body.location,

			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			phone: req.body.phone,
			address: req.body.address
	};

	register.child('Events').push(newUser);
	res.render("index.ejs", {title: 'Registration'});
}

	

})


app.listen(3000, function(){
	console.log('server started on port 3000...');
});

