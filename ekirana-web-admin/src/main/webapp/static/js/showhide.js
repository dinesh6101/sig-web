function toggleVisibility(objectID) {
	var object = document.getElementById(objectID);
	if(object != null) {
		state = object.style.display;
		if (state == 'none') {
			object.style.display = 'block';
		}
		else {
			object.style.display = 'none';
		}
	}
}
