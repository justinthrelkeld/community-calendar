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
		  if (req.status === 200) {
        req.overrideMimeType("text/json; charset=utf-8");
      } else if (req.status === 404) {
        console.log('returned 404'); //you wouldn't want to see that anyways
        req.abort();
        req.overrideMimeType("text/plain; charset=utf-8");
      }
      //console.log(req);
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
				console.log('parsing Events'); //this returns twice and I don't know how to fix it
				parseEvents(myObject);
			}
		}
		//console.log(activeAjaxConnections);
	}, true);
	ai.doGet();

}

getEventFiles = function(fromToday, daysToLookAhead, today) {
	
	// set defult values
	// 1 would start from today, 2 would start from tomorrow
	fromToday = (typeof fromToday !== 'undefined' ? fromToday : 1);
	daysToLookAhead = (typeof daysToLookAhead !== 'undefined' ? daysToLookAhead : 3);
	var events;
	var totalDays = fromToday + daysToLookAhead;
	var daysLater;
	var date;
	if (typeof today !== 'undefined') {
		daysLater = new Date();
    console.log("Manual start day: " + today);
    date = today.split('.'); // 20.10.13
    date = {
      "getDate": parseInt(date[0], 10) - 1, //everything starts at 0
      "getMonth": parseInt(date[1], 10) - 1, //0 for January
      "getFullYear": 2000 + parseInt(date[2], 10) // 2000+13 <- glad this one doesn't, oh wait, it does 0 is for no years
    };
    //daysLater.setDate(date.getDate);
    daysLater.setMonth(date.getMonth, date.getDate);
    daysLater.setFullYear(date.getFullYear);
  };

  //get event files fromToday offset
  for (var i = fromToday; i <= totalDays; i++) {
    if (typeof today === 'undefined') {
    	daysLater = new Date();
    } else {
    	daysLater.setMonth(date.getMonth, date.getDate);
    	daysLater.setFullYear(date.getFullYear);
    }
		//add `i` day(s) to date
		daysLater.setDate(daysLater.getDate() + i);
		//string this date in dd.mm.yy form
		S_thisDay = daysLater.getDate() + "." + (daysLater.getMonth() + 1) + "." + daysLater.getFullYear().toString().substring(2, 4);
		console.log("requesting file " + S_thisDay + ".json");
		makeRequest(S_thisDay);
	}

};
