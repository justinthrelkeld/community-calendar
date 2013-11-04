
eventDateFromString = function (dateString) {
  d = new Date();
  date = dateString.split('.');
  d.setDate(parseInt(date[0], 10) - 1);
  d.setMonth(parseInt(date[1], 10) - 1);
  d.setFullYear(parseInt(date[2], 10) + 2000);
  return d;
}

timeFromString = function (timeString) {
  // set new date object
  var d = new Date();
  // match |`digit`|:|`digit``digit`|`whitespace`|`p`|case insensitive
  var timeParsed = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
  
  timeParsed[1] = parseInt(timeParsed[1], 10);
  timeParsed[2] = parseInt(timeParsed[2], 10);
  // time Hour, length of string
  var timeParsed1String = timeParsed[1] + '';
  var timeParsed1Len = timeParsed1String.length;
  // if p does not exist and the length of the time is 4 or 3
  if (!timeParsed[3] && (timeParsed1Len === 4 || timeParsed1Len === 3)) {
    // cut form the end of timeStr
    d.setHours(parseInt(timeParsed1String.substr(0, timeParsed1Len - 2), 10));
    d.setMinutes(parseInt(timeParsed1String.substr(timeParsed1Len - 2), 10) || 0);
    // if minutes
  } else if (timeParsed[2]) {
    // set hour without adding 12
    d.setHours(timeParsed[1]);
    d.setMinutes(timeParsed[2] || 0);
    // if p and hour is not 12 
  } else if (timeParsed[3] && (timeParsed[1] !== 12)) {
    // set hour, adding 12
    d.setHours(timeParsed[1] += 12);
    d.setMinutes(timeParsed[2] || 0);
  }
  return d;
}

timeTo12Hour = function(dObj) {
  var hours = dObj.getHours();
  var minutes = dObj.getMinutes();
  var d12Hour;
  if (hours > 12) {
    d12Hour = {
      "getHour": hours - 12,
      "getMinute": minutes,
      "getPeriod": "pm"
    } 
  } else {
    d12Hour = {
      "getHour": hours,
      "getMinute": minutes,
      "getPeriod": "am"
    }
  }
  return d12Hour;
}

updateCalendar = function (daysOfEvents) {
  var calendars = document.querySelectorAll('section.calendar ul.events');
  //update calendar 0
  calendars[0].innerHTML = daysOfEvents;
}

parseEvents = function (events, eventkeys) {
  // date formatting arrays
  var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      weekdays_abb = ["Sun","Mon","Tues","Weds","Thurs","Fri","Sat"],
      months = ["January","February","March","April","May","June","July","August","September","October","November","December"],
      months_abb = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  /* ------TODO------
  // - Sort object by date (day) and by time. Passing the dates as an object will help with that too
  // - Prob want to make it only create one day of events at a time. This will most likely bog down
  // - Make getEventFiles() accept a dev argument for the start date so the files mustn't renamed every couple days < done
  // - Pass dates to parseEvent() in an array so we don't waste resource parsing a once date straight back to a date < 
  //     prob wont be worth the trouble, because it would require knowing if the file returned or not. 
  //     hey i just thought of something, perhaps if in the getJson.js > makeRequest(), it already passes the pretty date, 
  //     I could just move the pretty date var into the function and pass the whole date object, and when the requested file is added to the 
  //     object of events just add the date to the dateOfEvents object. < won't be easy, I thought of the fact that the async XHRs will not return in order and the dates were only the last date, so the date object was updating all instances of the date.
  // --More to come--
  */

  var daysCount = eventkeys.length,
  daysOfEvents_HTML = "";
  //console.log("daysCount" + daysCount);
  //console.log(eventkeys);
  console.log(eventkeys);
  var dasdd = new Date();
  console.log(dasdd.toString());
  //console.log(dates[0].getDate() + '.' + (dates[0].getMonth() + 1) + '.' + (dates[0].getFullYear() - 2000));

  for (var i = 0; i < daysCount; i++) {
    //console.log(eventKeys);

    var date = eventDateFromString(eventkeys[i]);
    var eventsDateH2 = (months[date.getMonth()]) + ' ' + (date.getDate() + 1) + ', ' + (date.getFullYear() - 2000);
    var event_ul_id = (date.getFullYear() - 2000) + '-' + (date.getMonth() - 1) + '-' + (date.getDate() + 1);
    //event_ul_id = (dates.getMonth() - 1)+'-'+date.getDate+'-'+date.getFullYear;
    
    // If we want much more complex templating then this we should probly use pre compiled Handlebars or something similar
    daysOfEvents_HTML +=
    '<li class="date">\n' + 
    '  <h2>' + eventsDateH2 + '</h2>\n' +
    '  <ul id="' + event_ul_id + '">\n';

    for (var i2 = 0, l2 = events[eventkeys[i]].length; i2 <= l2 - 1; i2++) {
      //te = thisEvent
      var te = events[eventkeys[i]][i2];
      // parse the time string to date object, which the hour is 24 hour, then transform the date object to 12 hour object (not date Object)
      var eventStartTime = timeTo12Hour(timeFromString(te.startTime));
      var eventEndTime = timeTo12Hour(timeFromString(te.endTime));
      //console.log(eventTimeStart);
      var prettyEventStartTime =
      '<time>\n' +
      '  <span class="hour">' + eventStartTime.getHour + '</span>\n' +
      '  <span class="minute">' + eventStartTime.getMinute + '</span>\n' +
      '  <span class="daypart ' + eventStartTime.getPeriod + '">' + eventStartTime.getPeriod + '</span>\n' +
      '</time>\n';
      
      var prettyEventEndTime =
      '<time>\n' +
      '  <span class="hour">' + eventEndTime.getHour + '</span>\n' +
      '  <span class="minute">' + eventEndTime.getMinute + '</span>\n' +
      '  <span class="daypart ' + eventEndTime.getPeriod + '">' + eventEndTime.getPeriod + '</span>\n' +
      '</time>\n';
      
      daysOfEvents_HTML +=
      '<li class="event">\n'+
        prettyEventStartTime +
      '  <span class="title">'+te.title+'</span>\n'+
      '  <span class="location">'+te.location.address+'</span>\n'+
      '</li>\n';
    }
    daysOfEvents_HTML += 
    '  </ul>\n' +
    '</li>\n';
  }

  updateCalendar(daysOfEvents_HTML);

}
// 1,0 gets today and 0 days ahead, so 1 file
// 1,5 gets today and 5 days ahead, so 6 files
getEventFiles(1,5,[23,10,13]);
// ^ ^ ^ ^ ^ ^ ^- this does everythings!

