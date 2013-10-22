var activeAjaxConnections = 0;
var myObject = {};

makeRequest = function (Fname) {
	//connection opened
	activeAjaxConnections++;
	//new xmlhttprequest
	var ai = new AJAXInteraction("/events/" + Fname + ".json", function(req) {
		//connection closed
		activeAjaxConnections--;
		// if the file has been loaded
		if (req.readyState === 4) {
			//if it is ok or hasn't been modified (cached)
			if (req.status === 200 || req.status === 304) {
				//console.log("good");
				myObject[Fname] = JSON.parse(req.responseText);
			} else if (req.status === 404) {
				//console.log("not found");
			}
			//console.log(req.responseText);
			// if all requests have returned
			if (activeAjaxConnections === 0) {
				parseEvents(myObject);
			}
		}
		//console.log(activeAjaxConnections);
	}, true);
	ai.doGet();

}

getEventFiles = function(from, daysToLookAhead) {
	
	// set defult values
	from = (typeof from !== 'undefined' ? from : 1);
	daysToLookAhead = (typeof daysToLookAhead !== 'undefined' ? daysToLookAhead : 3);
	var events;
	var totalDays = from + daysToLookAhead;
	
	//get event files from offset
	for (var i = from; i <= totalDays;) {
		var daysLater = new Date();
		//add `i` day(s) to date
		daysLater.setDate(daysLater.getDate() + i);
		//string this date in dd.mm.yy form
		S_thisDay = daysLater.getDate() + "." + (daysLater.getMonth() + 1) + "." + daysLater.getFullYear().toString().substring(2, 4);
		console.log("requesting file " + S_thisDay + ".json");
		makeRequest(S_thisDay)
		i++;
	}

};