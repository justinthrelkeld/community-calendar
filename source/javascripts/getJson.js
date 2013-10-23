var activeAjaxConnections = 0;
var myObject = {};

makeRequest = function (Fname) {
	//connection opened
	activeAjaxConnections++;
	//console.log("activeAjaxConnections: " + activeAjaxConnections + " on opened");
	//new xmlhttprequest
	var ai = new AJAXInteraction("/events/" + Fname + ".json", function(req) {
		//connection closed

		//if the headers were returned
		if (req.readyState === 2) {
			activeAjaxConnections--;
			//console.log("activeAjaxConnections: " + activeAjaxConnections + " on closed");
		}
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
			//console.log(activeAjaxConnections); //if this is enabled, it calls parseEvents() twice, perhaps due to something being there for it check how many connections are available  
			// if all requests have returned
			if (activeAjaxConnections === 0) {
				console.log('parsing Events');
				parseEvents(myObject);
			}
		}
		//console.log(activeAjaxConnections);
	}, true);
	ai.doGet("text/json; charset=utf-8");

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