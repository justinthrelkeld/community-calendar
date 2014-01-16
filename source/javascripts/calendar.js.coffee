
# only the returned result will be used, so this must retun a string of HTML. 
# The date object is avilable through the first argument

preDayOfEvents = (d) ->
	"""
	<li class="date">
	  <h2>#{utils.formatDate(d, "%F %j, %Y")}</h2>
	  <ul id="#{utils.formatDate(d, "%Y-%n-%j")}">
	"""

perEvent = (event, t) ->
	"""
	<li class="event">
	  <time>
	    <span class="hour">#{ t.start12Hour.getHours }</span>
	    <span class="minute">#{ t.start12Hour.getMinutes }</span>
	    <span class="daypart #{ t.start12Hour.getPeriod }">#{ t.start12Hour.getPeriod }</span>
	  </time>
	  <span class="title">#{event.title}</span>
	  <span class="location">#{event.location.address}</span>
	</li>
	"""

postDayOfEvents = (d) ->
	"""
	  </ul>
	</li>
	"""

noEvents = () ->
	"""
	<h1>NO EVENTS!<span class="sad">:_(</span>
	<p>Within the criteria, change the filter in settings, I don't know where it is either. :P</p>
	"""

eventDateFromString = (dateString) ->
	d = new Date()
	date = dateString.split('.')
	d.setDate(parseInt(date[0], 10))
	d.setMonth(parseInt(date[1], 10) - 1)
	d.setFullYear(parseInt(date[2], 10) + 2000)
	d

events = {
	# tree?
	dates:       [   ]
	keys:       [     ]
	events:       { }
	datesByName:  { }
}
#object watch polyfill https://gist.github.com/eligrey/384583
html = ""
fileReturned = (filename, dayOfEvents) ->
	# add the day of events to the events object with the filename as the key
	events.events[filename] = dayOfEvents
	# push the name into an array for sorting purposes
	filenameDate = eventDateFromString(filename).getTime()
	events.dates.push({date: filenameDate, eventDay: filename})
	events.datesByName[filename] = filenameDate
	events.keys.push filename
	
	# before the day of events
	#preDayOfEvents(filenameDate)
	
	for event in dayOfEvents
		event.time = {}
		# add convert the times to milliseconds and store them in the event object within a time object
		event.time.startTime = utils.timeFromString(event.startTime).getTime()
		event.time.endTime = utils.timeFromString(event.endTime).getTime()
		
	# sort the events within this file, these are held in an array, no need for keys, for now
	#utils.sort_soonest dayOfEvents, "time.startTime"
	count++ #makes sure it only runs the expected amount of times
	#console.log filename + " event returned: " + count

allFilesHaveReturned = ->
	# create copy of event keys for sorting
	events.order = events.dates
	events.order.sort (a,b) ->
		a.date - b.date
	
	allFilesHaveReturnedcount++ # makes sure it only runs the expected amount of times
	#console.log "all files have returned: " + allFilesHaveReturnedcount
	#console.log events
	parseEvents()

realUpdateCalendar = (input) ->
	HTML = input || html
	document.querySelector("ul.events").innerHTML = HTML

updateCalendar = ->
	if document.readyState is "loading"
		utils.attachToOnload ->
			realUpdateCalendar()
	else 
		realUpdateCalendar()

parseEvents = ->
	if events.keys[0]?
		events.order.sort (a,b) ->
			a.date - b.date
		for _day in [0..events.order.length - 1]
			# this holds the name of the file and the date in milliseconds 
			dayDate = events.order[_day]
			# day of events
			day = events.events[events.order[_day].eventDay]
			# sorting events by startTime
			day.sort (a,b) ->
				a.time.startTime - b.time.startTime

			d = new Date(events.datesByName[dayDate.eventDay])
			
			# before the day of events
			html += preDayOfEvents d
			
			for _event in [0..day.length - 1]
				event = day[_event]
				# set up time variables
				start24Hour = new Date(event.time.startTime)
				end24Hour = new Date(event.time.endTime)
				start12Hour = utils.timeTo12Hour start24Hour, "0M" 
				end12Hour = utils.timeTo12Hour end24Hour, "0M" 
				# time object
				T = 
					start24Hour: start24Hour
					end24Hour: end24Hour
					start12Hour: start12Hour
					end12Hour: end12Hour

				html += perEvent event, T

			html += postDayOfEvents d

	else
		html = @options.parsing.noEvents()

	updateCalendar()


# in cases where it seems that this ran twice, in most cases it is due to the fact that when an XML HTTP request is aborted they are considered done. When the browser refreshes, the requests are aborted thus complete, thus runs all done
count = 0
allFilesHaveReturnedcount = 0

utils = new Utils
	dateRange:
		from: [23,10,13]
		to: 4
	dir: '/events/'
	whenFileReturns: (filename, dayOfEvents) ->
		fileReturned(filename, dayOfEvents)
	
	whenBatchReturns: ->
		allFilesHaveReturned()

utils.init()
window.utils = utils
window.updateCalendar = realUpdateCalendar

###if document.readyState is "loading"
	utils.attachToOnload ->
		calendarElement = document.querySelector("ul.events")
		console.log document.readyState
		console.log calendarElement###

### extra advanced toys ###
###class setOptions
	from: ->
		res = @.value.split(',', 3).map(Number)
		utils.options.dateRange.from = res
	to: ->
		res = parseInt(@.value, 10)
		utils.options.dateRange.to = res
###
# if element does not exsist then run function when loaded else run function
###settingsPannel = ->
	console.log "settingsPannel"
	setOption = new setOptions()
	element = document.getElementById "settings"
	if element?
		inputEle = element.querySelectorAll "input"
		inputs = {}
		# abstract elements and add listeners
		for ele in [0..inputEle.length - 1]
			inputs[inputEle[ele].name] = inputEle[ele]
		console.log inputs
		inputs.from.addEventListener "keyup", setOption.from, false
		inputs.to.addEventListener "keyup", setOption.to, false
		inputs.update.addEventListener "click", wgoat.run, false

attachToOnload = (newFunction) ->
	if typeof window.onload isnt "function"
		window.onload = newFunction
	else
		oldOnLoad = window.onload
		window.onload = ->
			oldOnLoad() if oldOnLoad
			newFunction()###
		

###if document.readyState is "interactive" || document.readyState is "complete"
	settingsPannel()
else
	attachToOnload(settingsPannel)

###