AJAXInteraction = function (url, callback, custom) {

	var req = init();
	req.onreadystatechange = processRequest;
			
	function init() {
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	
	function processRequest () {
		if (typeof custom !== 'undefined' && callback) callback(req);
		else if (typeof custom === 'undefined' && req.status == 200) {
			if (req.readyState == 4) {
      	if (callback) callback(req.responseText);
    	} else if (req.status == 404) {
        //console.log("error: No events for that day... Make your own!");
      }
		}
	}

	this.doGet = function(contentType) {
		req.open("GET", url, true);
		//if (contentType !== 'undefined') {req.overrideMimeType(contentType)}//responseType
		//req.addEventListener("");
		req.send();
	}
	
	this.doPost = function(body) {
		req.open("POST", url, true);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send(body);
	}
}