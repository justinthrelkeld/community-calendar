class Utils

	constructor: (params) ->
		# default options
		@options =
			dateRange: #day,month,two/four digit year
				#from: [1,1,14] is optional. default is today
				to: 5 # days after
			dir: '/events/'
			# thats good for now

		# add params to options if any
		@objectMergeRecursive @options, params;

	### Green light... Go Go Go! ###
	init: =>
		@activeAjaxConnections = 0
		@events = {events: {},keys: []}
		@eventsDates = @getFiles(@options.dateRange)
	
	### sort ###
	sort: (method) ->
		switch method
			#when "most-recent" then @sort_mostRecent()
			when "soonest" then @sort_soonest()
			else throw new Error "Sort: no sort method of that sort :)"
	
	### sorting methods ###
	reference: (obj, str) ->
		str.split(".").reduce ((o, p) ->
			o[p]
		), obj
	
	sort_soonest: (obj, prop) ->
		obj.sort((a, b) ->
			reference(a, prop) - reference(b, prop)
		)

	### getFiles ###
	getFiles: (dateRange) ->
		d = @figureDateRange dateRange
		datesForFiles = {dates: {}, keys: []}
		# for every day from date until end date
		@activeAjaxConnections = d.to + 1 #to makeup for the start day
		#console.log "connections open " + @activeAjaxConnections
		for day in [0..d.to]
			dateOffset = new Date(d.from.getTime())
			# add a day to the date
			dateOffset.setDate d.from.getDate() + day
			# format date
			name = "#{@formatDate dateOffset, "%j.%n.%y"}.json"
			# add formatted date and date time to object
			datesForFiles.dates[name] = dateOffset.getTime()
			# add formatted date as keys to array
			datesForFiles.keys.push name
			#get the file
			@getFile name

		datesForFiles
	
	### abstracting dateRange ###
	figureDateRange: (d) ->
		# basic functionality. Not sure how much error checking should be done
		# new date from array in js form
		if d.from?
			from = new Date((if d.from[2] > 99 then d.from[2] else 2000 + d.from[2]), d.from[1]-1, d.from[0])
		else
			from = new Date()
		#console.log from.getDate() + "." + from.getMonth() + "." + from.getFullYear()
		to = d.to

		#if Object.prototype.toString.call d.from is '[object Array]' && d.from.length < 4
			# if to is a number and not empty
		if ((parseInt d.to, 10 || 0))
			to = d.to
		{from: from, to: to}

		#else 
		#	throw new Error "DateRange: must have three indexed in the array eg: [d,m,yy]"

	### get files, add to object ###
	getFile: (filename) ->
		#@activeAjaxConnections++ # add an open connection
		ajax = new @Ajax
			scope: @
			mimeType: "application/json"
			uri: @options.dir + filename
			responseType: 'json'
			callback: (res) ->
				if res.readyState is 2
					if res.status is 404
						res.abort() # if error page then abort loading
				if res.readyState is 4 # if loading is done
					@activeAjaxConnections-- # connection has returned headers
					if res.status is 200 || res.status is 304 # if OK or Not Modified
						if typeof res.response is "object"
							reponse = res.response
						else if typeof res.response is 'string'
							response = JSON.parse(res.responseText)
						
						@options.whenFileReturns filename, response
					if @activeAjaxConnections is 0 # if all the requests have been returned and are done loading
						#console.log "on 0, #{filename}, activeAjaxConnections " + @activeAjaxConnections
						@options.whenBatchReturns()

		ajax.doGet()

	### Abstract Ajax ###
	Ajax: (options) ->
		processRequest = ->
			if !options.scope? then options.scope = this

			options.callback.call(options.scope, xhr) if options.callback?

		xhr = new XMLHttpRequest()
		xhr.onreadystatechange = processRequest

		@doGet = ->
			xhr.open "GET", options.uri, true
			xhr.overrideMimeType(options.mimeType) if options.mimeType?
			xhr.timeout = options.timeout || 4000
			xhr.ontimeout = options.ontimeout || null
			if typeof options.requestHeaders is 'object'
				for r,i in options.requestHeaders
					xhr.setRequestHeader(options.requestHeaders[i][0],options.requestHeaders[i][1])
			
			#if options.responseType? && typeof xhr.responseType is 'string' 
			#	console.log "response"
			#	xhr.responseType = options.responseType
			xhr.send null
		return
	###            ###
	###  Utilities ###
	###            ###

	### Time From String ###
	timeFromString: (timeString) ->
		# This eats a string argument that is in some form of legible time and poops out a Date Object
		# Examples of valid times
		# `2pm` `2Am` `1403` `2:03p`

		# match |`digit`|`Passive`:|`digit``digit`|`whitespace`|`a` or `p`|case insensitive
		timeParsed = timeString.match(/(\d+)(?::(\d\d))?\s*([ap]?)/i)
		
		#timeParsed[0] is the first group
		#timeParsed[1] is the hour. if it is a 24hour time minute is null
		#timeParsed[2] is the minute
		#timeParsed[3] is "" if p does not exist else is "p" or "P"
		
		timeParsed[1] = parseInt(timeParsed[1], 10)
		timeParsed[2] = parseInt(timeParsed[2], 10)
		
		# time Hour, length of string
		timeParsedString = timeParsed[1] + ""
		timeParsedLen = timeParsedString.length
		addHours = 0
		tHours = timeParsed[1]
		tMinutes = timeParsed[2]
		
		#console.log(timeParsed);
		d = new Date() # set new date object
		# if 12 hour time
		if timeParsed[3].toUpperCase() is "P" and timeParsed[1] isnt 12
			addHours = 12
		# if 24 hour time
		else if timeParsed[3] is "" and isNaN(timeParsed[2])
			tHours = timeParsedString.substr(0, timeParsedLen - 2)
			tMinutes = timeParsedString.substr(timeParsedLen - 2)
		
			d.setHours parseInt(tHours, 10)
			d.setMinutes parseInt(tMinutes, 10)
		d.setHours parseInt(tHours, 10) + addHours
		d.setMinutes parseInt(tMinutes, 10) or 0
		d
	
	### Time To 12 Hour ###
	timeTo12Hour: (dObj, arg1, arg2, arg3) ->
		hours = dObj.getHours()
		minutes = dObj.getMinutes()
		h = undefined
		m = undefined
		p = undefined
		if hours is 12
			h = hours; m = minutes; p = "pm"
		else if hours > 12
			h = hours - 12; m = minutes; p = "pm"
		else
			h = hours; m = minutes; p = "am"

		if arg1 is "0M" || arg2 is "0M" || arg3 is "0M"
			if m < 10
				m = "0" + m

		if arg1 is "0H" || arg2 is "0H" || arg3 is "0H"
			if h < 10
				h = "0" + h

		getHours: h
		getMinutes: m
		getPeriod: p

	### Merge/Overwrite Object/Array ###
	objectMergeRecursive: (obj1, obj2) ->
		if Object.prototype.toString.call(obj1) is '[object Array]' &&
		   Object.prototype.toString.call(obj2) is '[object Array]'
			for row, i in obj2
				obj1[i] = obj2[i]
		else
			for k of obj2
				if typeof obj1[k] is 'object' and typeof obj2[k] is 'object'
					@objectMergeRecursive obj1[k], obj2[k]
				else
					obj1[k] = obj2[k]
	
	### Format Date (under development) ###
	formatDate: (d, format) ->
		# Day/Month arrays
		weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
		months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
		month = d.getMonth()
		day = d.getDay()
		date = d.getDate()
		year = d.getFullYear()
		
		dateParsed = format
			.replace /%d/g, ->
				### Week day Stuff ###
				# `d` Day of the month, 2 digits with leading zeros | 01 to 31
				if date < 10 then "0" + date else date
			
			.replace /%D/g, ->
				# `D` A textual representation of a day, three letters | Mon through Sun
				weekdays[day].slice 0, 3
			
			.replace /%j/g, ->
				# `j` Day of the month without leading zeros | 1 to 31
				date
			
			.replace /%l/g, ->
				# 'l' A full textual representation of the day of the week | Sunday through Saturday
				weekdays[day]
			
			.replace /%S/g, ->
				# `S` English ordinal suffix for the day of the month, 2 characters | st, nd, rd or th. Works well with `j`
				switch date
					when 1 then "st"
					when 2 then "nd"
					when 3 then "rd"
					else "th"
			
			.replace /%w/g, ->
				# `w` Numeric representation of the day of the week | 0 (for Sunday) through 6 (for Saturday)
				day

			.replace /%z/g, ->
				# `z` The day of the year (starting from 0) | 0 through 365
				Math.ceil((d - new Date(year,0,1)) / 86400000)

			.replace /%F/g, ->
				### Month stuff ###
				# `F` A full textual representation of a month, such as January or March | January through December
				months[month]

			.replace /%F/g, ->
				# `m` Numeric representation of a month, with leading zeros | 01 through 12
				if month + 1 < 10 then "0" + (month + 1) else month + 1
			
			.replace /%M/g, ->
				# `M` A short textual representation of a month, three letters | Jan through Dec
				months[month].slice 0, 3
			
			.replace /%n/g, ->
				# `n` Numeric representation of a month, without leading zeros | 1 through 12
				month + 1
			
			.replace /%t/g, ->
				# `t` Number of days in the given month | 28 through 31
				new Date(d.getYear(), month, 0).getDate()
			
			.replace /%L/g, ->
				### Year Stuff ###
				# `L` Whether it's a leap year | 1 if it is a leap year, 0 otherwise.
				new Date(year, 1, 29).getMonth() is 1
			
			.replace /%Y/g, ->
				# `Y` A full numeric representation of a year, 4 digits | Examples: 1999 or 2003
				year
			
			.replace /%y/g, ->
				# `y` A two digit representation of a year | Examples: 99 or 03
				y = year.toString()
				# Or if all the events are "new" (grater then the year 2001
				# d.getFullYear() - 2000
				l = y.length
				y.slice l - 2, l
		dateParsed
	
	### Set Option ###
	set: (options) ->
		@objectMergeRecursive @options, options


root = window
root.Utils = Utils