var activeAjaxConnections = 0;
var eventsObject = {};
var eventsObjectKeys = [];

makeRequest = function (dObj) {
  var fileName = (dObj.getDate()) + '.' + (dObj.getMonth() + 1) + '.' + (dObj.getFullYear() - 2000);
  console.log("requesting file " + fileName + ".json");
  //connection opened
  activeAjaxConnections++;
  //console.log("activeAjaxConnections: " + activeAjaxConnections + " on opened");
  //new xmlhttprequest
  var ai = new AJAXInteraction("/events/" + fileName + ".json", function(req) {
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
    }
    // if the file has been loaded
    if (req.readyState === 4) {
      //if it is ok or hasn't been modified (cached)
      if (req.status === 200 || req.status === 304) {
        //console.log("good");
        eventsObject[fileName] = JSON.parse(req.responseText);
        //append as key, or we can not pass another argument to parseEvents() and use the object.getOwn
        //I tried to pass the date object, but for some reason it is set as the last one before it sets it here :(
        eventsObjectKeys.push(fileName);

      } else if (req.status === 404) {
        //console.log("not found");
      }
      //console.log(activeAjaxConnections);
      // if all requests have returned
      if (activeAjaxConnections === 0) {
        console.log('parsing Events'); //this returns twice sometimes and I don't know how to fix it.
        parseEvents(eventsObject, eventsObjectKeys);
      }
    }
    //console.log(activeAjaxConnections);
  }, true);
  ai.doGet();

}

getEventFiles = function(fromToday, daysToLookAhead, today) {

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
    date = {
      "getDate": today[0] - 1, //everything starts at 0
      "getMonth": today[1] - 1, //0 for January
      "getFullYear": 2000 + today[2] // 2000+13 <- glad this one doesn't, oh wait, it does 0 is for no years
    };
    //daysLater.setDate(date.getDate);
    daysLater.setMonth(date.getMonth, date.getDate);
    daysLater.setFullYear(date.getFullYear);
  };

  //get event files fromToday offset
  for (var i = fromToday; i <= totalDays; i++) {
    var thing = new Date();
    thing.setDate(1);
    thing.setMonth(1);
    thing.setFullYear(2018);
    if (typeof today === 'undefined') {
      daysLater = new Date();
    } else {
      daysLater.setMonth(date.getMonth, date.getDate);
      daysLater.setFullYear(date.getFullYear);
    }
    //add `i` day(s) to date
    daysLater.setDate(daysLater.getDate() + i);
    makeRequest(daysLater);
  }

};
