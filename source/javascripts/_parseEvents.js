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
  // match |`digit`|`Passive`:|`digit``digit`|`whitespace`|`a` or `p`|case insensitive
  var timeParsed = timeString.match(/(\d+)(?::(\d\d))?\s*([ap]?)/i);

  //timeParsed[0] is the first group
  //timeParsed[1] is the hour. if it is a 24hour time minute is null
  //timeParsed[2] is the minute
  //timeParsed[3] is "" if p does not exist else is "p" or "P"

  timeParsed[1] = parseInt(timeParsed[1], 10);
  timeParsed[2] = parseInt(timeParsed[2], 10);
  // time Hour, length of string
  var timeParsedString = timeParsed[1] + '';
  var timeParsedLen = timeParsedString.length;
  var addHours = 0;
  var tHours = timeParsed[1];
  var tMinutes = timeParsed[2];
  //console.log(timeParsed);
  if (timeParsed[3].toUpperCase() === "P" && timeParsed[1] !== 12) {
    addHours = 12;
  } else if (timeParsed[3] === "" && isNaN(timeParsed[2])) {
    // 12,34 1,23
    tHours = timeParsedString.substr(0, timeParsedLen - 2);
    tMinutes = timeParsedString.substr(timeParsedLen - 2);

    //console.log(tHours);
    //console.log(tMinutes);

    d.setHours( parseInt(tHours, 10) );
    d.setMinutes( parseInt(tMinutes, 10) );
  }

  d.setHours( parseInt(tHours, 10) + addHours);
  d.setMinutes( parseInt(tMinutes, 10) || 0 );

  return d;
};

timeTo12Hour = function(dObj) {
  var hours = dObj.getHours();
  var minutes = dObj.getMinutes();
  var h,m,p;
  if (hours === 12) {
    h = hours;
    m = minutes;
    p = "pm";
  } else if (hours > 12) {
    h = hours - 12;
    m = minutes;
    p = "pm";
  } else {
    h = hours;
    m = minutes;
    p = "am";
  }
  return {"getHour": h,"getMinute": m,"getPeriod": p};
}

updateCalendar = function (daysOfEvents) {
  var calendars = document.querySelector('section.calendar ul.events');
  //update calendar 0
  calendars.innerHTML = daysOfEvents;
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
  //sortable = {startTimes: [], endTimes: [], eventkeys: eventkeys};
  if (daysCount != 0) {
    for (var i = 0; i < daysCount; i++) {

      var date = eventDateFromString(eventkeys[i]);
      var eventsDateH2 = (months[date.getMonth()]) + ' ' + (date.getDate() + 1) + ', ' + (date.getFullYear());
      var event_ul_id = (date.getFullYear()) + '-' + (date.getMonth() - 1) + '-' + (date.getDate() + 1);

      for (var i2 = 0, l2 = events[eventkeys[i]].length - 1; i2 < l2; i2++) {
        events[eventkeys[i]][i2].startTimeDateObj = timeFromString(events[eventkeys[i]][i2].startTime);
        events[eventkeys[i]][i2].endTimeDateObj = timeFromString(events[eventkeys[i]][i2].endTime);
      }

      //console.log(sortable);
      eventkeys.sort();
      events[eventkeys[i]].sort(function(a,b){
        return a.startTimeDateObj-b.startTimeDateObj
      });
      //console.log(events);

      // If we want much more complex templating then this we should probly use pre compiled Handlebars or something similar
      daysOfEvents_HTML +=
      '<li class="date">\n' +
      '  <h2>' + eventsDateH2 + '</h2>\n' +
      '  <ul id="' + event_ul_id + '">\n';

      for (var i2 = 0, l2 = events[eventkeys[i]].length - 1; i2 < l2; i2++) {
        //te = thisEvent
        var te = events[eventkeys[i]][i2];
        // parse the time string to date object, which the hour is 24 hour, then transform the date object to 12 hour object (not date Object)
        var eventStartTime = timeTo12Hour(te.startTimeDateObj);
        var eventEndTime = timeTo12Hour(te.endTimeDateObj);

        if (eventStartTime.getMinute < 10) {
          eventStartTime.getMinute = "0" + eventStartTime.getMinute;
        }
        if (eventEndTime.getMinute < 10) {
          eventEndTime.getMinute = "0" + eventEndTime.getMinute;
        }

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
  } else {
    daysOfEvents_HTML =
    'Sorry, no events within range';
  }
  updateCalendar(daysOfEvents_HTML);

}
// 1,0 gets today and 0 days ahead, so 1 file
// 1,5 gets today and 5 days ahead, so 6 files
getEventFiles(1,5,[23,10,13]);
// ^ ^ ^ ^ ^ ^ ^- this does everythings!
