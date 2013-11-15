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
  var ajax = new Ajax({
    contentType: "application/json",
    url: "/events/" + fileName + ".json",
    callback: function(res) {
      activeAjaxConnections--;
      //if it is ok or hasn't been modified (cached)
      if (res.status === 200 || res.status === 304) {
        eventsObject[fileName] = JSON.parse(res.responseText);
        eventsObjectKeys.push(fileName); 
      }
      //console.log(activeAjaxConnections);
      // if all requests have returned
      if (activeAjaxConnections === 0) {
        console.log('parsing Events');
        parseEvents(eventsObject, eventsObjectKeys);
      }
    }
  });
  ajax.doGet();
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