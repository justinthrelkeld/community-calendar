preDayOfEvents = (d) ->
	"""
	<li class="date">
	  <h2 class="j">#{utils.formatDate(d, "%F %j, %Y")}</h2>
	  <ul id="#{utils.formatDate(d, "%Y-%n-%j")}">
	"""

perEvent = (event, id, t) ->
	# prefix id with e for event, the markers/points will have a prefix of p or *m
	"""
	<li class="event" id="e#{id}">
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