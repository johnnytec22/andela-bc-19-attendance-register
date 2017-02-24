//local storage
//save
function saveData(event_id, event) {
	var str = JSON.stringify(event);
	localStorage.setItem(event_id, event);
}
//retrieve
function getData(id){
	var str = localStorage.getItem(id);
	var event = JSON.parse(str);
	if (!event){
		event = {};
	}
	return event;
}


