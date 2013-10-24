updateCalendar = function (daysOfEvents) {
  var calendars = document.querySelectorAll('section.calendar ul.events');
  //update calendar 0
  calendars[0].innerHTML = daysOfEvents;
}

parseEvents = function (events) {
  // date formatting arrays
  var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      weekdays_abb = ["Sun","Mon","Tues","Weds","Thurs","Fri","Sat"],
      months = ["January","February","March","April","May","June","July","August","September","October","November","December"],
      months_abb = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  /* ------TODO------
  // - Sort object by date (day) and by time. Passing the date as an object will help with that too
  // - Prob want to make it only create one day of events at a time. This will most likely bog down
  // - Make getEventFiles() accept a dev argument for the start date so the files mustn't renamed every couple days
  // - Pass dates parseEvent() in an array so we don't waste resource parsing a one date straight back to a date
  // --More to come--
  */
  var eventDays = Object.getOwnPropertyNames(events),
      daysCount = eventDays.length,
      //dayOfEvents_HTML = [],
      daysOfEvents_HTML = "";
      //console.log(daysCount);

  for (var i = 0; i < daysCount; i++) {

    var date = eventDays[i].split('.'); // 20.10.13
    
    date = {
      "getDate": date[0],
      "getMonth": date[1],
      "getFullYear": 20 + date[2] // 20<2digitYear>
    };

    thisDayEventPrettyDate = date.getMonth+'-'+date.getDate+'-'+date.getFullYear;
    //dayOfEvents_HTML[thisDayEventPrettyDate] = [];
    /* some stuff for a more advanced date
    var d = new Date();
    d.setDate(parseInt(date.getDate,10));
    d.setMonth(parseInt(date.getMonth - 1,10)); // js month starts at 0 humans start at 1
    d.setFullYear(2000 + parseInt(date[2],10)); //faster to add numbers than concat strings and sense date object requires an int than it may as well be parsed first
    console.log(months[d.getMonth()] + ' ' + weekdays[d.getDay()] + ', ' + d.getFullYear());*/
    var prettyDate = date.getDate + ' ' + months[date.getMonth] + ', ' + date.getFullYear;
    
    // If we want much more templating then this we should proby use pre compiled Handlebars
    daysOfEvents_HTML +=
    '<li class="date">' + prettyDate + '\n' +
    '  <ul id="' + thisDayEventPrettyDate + '">\n';

    for (var i2 = 0; i2 <= events[eventDays[i]].length - 1; i2++) {
      //te = thisEvent
      var te = events[eventDays[i]][i2];

      daysOfEvents_HTML +=
      '<li class="event">\n'+
      '  <span class="time">'+te.startTime+'</span>\n'+
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
getEventFiles(1,10,"23.10.13");
//console.log(getEventFiles(1,5));
// ^ ^ ^ ^ ^ ^ ^- this does everythings!

