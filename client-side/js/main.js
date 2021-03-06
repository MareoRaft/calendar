//This is a TEMPLATE (notice the "{{privacy}}" variable drop-in).
// once we finish writing in python, we will then translate that to JS, so that a new request to the server won't need to be made every time the user wants to view more info on the calendar.
// Define websocket to be used for server interaction

//////////////////// GLOBALS ////////////////////
// use 'is' instead of 'check' for check-types library
let is = check
let socket = undefined
let HOUR_HEIGHT = 54
let PRIVACY = {{privacy}}
let SHOW_WEATHER = {{show_weather}}
let SHOW_WEATHER_TEXT = {{show_weather_text}}
let dayshift = 0
let forecasts = []
let events = []
let NUM_DAYS_TO_SHIFT = 1
let forecast_text_to_colors = {
	'Cloudy': ['#888888', 'black'], // or maybe white?
	'Partly Cloudy': ['#99AACC', 'black'],
	'Mostly Cloudy': ['#AAAAAA', 'black'],
	'Showers': ['#2277CC', 'white'],
	'Scattered Showers': ['#2277CC', 'white'],
	'Rain': ['#0055AA', 'black'],
	'Sunny': ['#FFFF44', 'black'],
	'Mostly Sunny': ['#EEFF99', 'black'],
	'Clear': ['#0080FF', 'black'],
	'Mostly Clear': ['#0080D0', 'black'],
	'Thunderstorms': ['#444400', 'white'], // don't think black would work here, but haven't verified!
	'Scattered Thunderstorms': ['#666644', 'white'], // or maybe black?
	'Breezy': ['#DAF2D3', 'black'],
}


///////////////// HELPERS /////////////////
function myParseDate(string) {
	// manually doing .setTimezone('EST') sucks.  We should override the Date constructor to set the time zone
	let datetime = Date.parse(string)
	// times from server are in EST.  Date object needs to know that so it can adjust times to user's locale/time zone correctly
	datetime.setTimezone('EST')
	return datetime
}

function myTodayShifted(dayshift=0) {
	// manually doing .setTimezone('EST') sucks.  We should override the Date constructor to set the time zone
	let today = Date.today().add({ days: dayshift })
	today.setTimezone('EST')
	return today
}

function hourDecimal(dt) {
	// From a Date (datetime) object, get the hours as a decimal
	// For example, the time 12:45 becomes 12.75
	is.assert.not.string(dt)
	let hour = dt.getHours()
	let minute = dt.getMinutes()
	let hour_decimal = hour + minute/60
	return hour_decimal
}

function hourDecimalFromString(dt_string) {
	is.assert.string(dt_string)
	let dt = myParseDate(dt_string)
	return hourDecimal(dt)
}

function isToday(datetime) {
	let date = datetime.clone().clearTime()
	let today = Date.today()
	let is_today = date.equals(today)
	return is_today
}

///////////////// DRAW FUNCTIONS /////////////////
// all of the draw functions also ERASE/REPLACE previously things drawn
function drawMonthAndYear(dayshift=0) {
	let date = myTodayShifted(dayshift)
	// retrieve month and year
	let month_name = date.getMonthName()
	let year_string = '' + date.getFullYear()
	// update month and year
	$('.month').html(month_name + ' ')
	$('.year').html(year_string)
}

function getWeekdatesToDraw(dayshift=0) {
	let weekdates = []
	for (let daychange = 0; daychange < 7; daychange++) {
		// we are using Date.js (www.datejs.com) to shift the day
		let date = myTodayShifted(dayshift + daychange)
		weekdates.push(date)
	}
	return weekdates
}

function drawWeekday(datetime, slot_num) {
	// slot_num is the number of the column where to draw the weekday and daynumber in month
	let weekday = datetime.getWeekdayName()
	let weekday_short = weekday.slice(0, 3)
	let day_num = datetime.getDate().toString()
	// put the info in the slot
	let weekday_id = "weekday-header-" + slot_num + " " + ".weekday"
	let $weekday = $('#' + weekday_id)
	$weekday.html(weekday_short)
	let day_num_id = "weekday-header-" + slot_num + " " + ".day-num"
	let $day_num = $('#' + day_num_id)
	$day_num.html(day_num)
	// iff the day is today, classify the day number as "today-num"
	if (isToday(datetime)) {
		if (day_num.length === 1) {
			// our way of making the 'skinny' numbers still have a round background circle
			let period_html = '<font class="today-num-background-text">.</font>'
			$day_num.html(period_html + day_num + period_html)
		}
		$day_num.addClass("today-num")
	} else {
		$day_num.removeClass("today-num")
	}
}

function drawWeekdays(dayshift=0) {
	let weekdates_to_draw = getWeekdatesToDraw(dayshift)
	for (let index in weekdates_to_draw) {
		let date = weekdates_to_draw[index]
		drawWeekday(date, index)
	}
}

function drawForecastInColumn(f, column_index) {
	let top = 0 * HOUR_HEIGHT
	let height = 24 * HOUR_HEIGHT
	let text = SHOW_WEATHER_TEXT? f['text']: ''
	let background_color = 'black'
	let color = 'white'
	if (f['text'] in forecast_text_to_colors) {
		background_color = forecast_text_to_colors[f['text']][0]
		color = forecast_text_to_colors[f['text']][1]
	} else {
		alert('Missing weather swatch.  Please report this error to Matt.')
	}
	// add to HTML
	let insertion_id = 'weekday-' + column_index
	let $f = $('<div/>', {class: 'event forecast', text: text})
	$('#' + insertion_id).append($f)
	$f.css({
		'top': '' + top + 'px',
		'height': '' + height + 'px',
		'background-color': background_color,
		'color': color,
		'opacity': '0.24',
	})
}

function drawEventInColumn(event, column_index) {
	let top = hourDecimalFromString(event['start_datetime']) * HOUR_HEIGHT
	let height = event['hour_duration'] * HOUR_HEIGHT
	let text = PRIVACY? 'busy': event['text']
	// add to HTML
	let insertion_id = 'weekday-' + column_index
	let $event = $('<div/>', {class: 'event calendar-event', text: text})
	$('#' + insertion_id).append($event)
	$event.css({
		'top': '' + top + 'px',
		'height': '' + height + 'px',
	})
}

function drawBlock(block, dayshift) {
	// verify that block falls in the correct timeframe!
	let weekdates_to_draw = getWeekdatesToDraw(dayshift)
	let block_date = myParseDate(block['date'])
	// IF the events are in order, THEN we can do this MORE EFFICIENTLY than we are doing it now:
	for (let column_index in weekdates_to_draw) {
		let weekdate = weekdates_to_draw[column_index]
		if (weekdate.equals(block_date)) {
			if (block['class'] === 'calendar-event') {
				drawEventInColumn(block, column_index)
			}
			else if (block['class'] === 'forecast') {
				drawForecastInColumn(block, column_index)
			}
			else {
				alert('Bad block.')
			}
			break
		}
	}
}

function drawBlocks(blocks, dayshift=0) {
	// erase events already on calendar
	$('.content-of-weekday').html('')
	// draw each event on the calendar
	for (block of blocks) {
		drawBlock(block, dayshift)
	}
}

function drawStatus(events, datetime_updated_string) {
	if (events.length > 0 && is.not.null(datetime_updated_string)) {
		// make status message
		let datetime_updated = myParseDate(datetime_updated_string)
		// see datejs source code itself for formatting examples
		let format = isToday(datetime_updated)? "h:mm tt": "MMMM d, h:mm tt";
		let friendly_string = datetime_updated.toString(format)
		let status_message = 'Last updated ' + friendly_string
		// update status icon
		$status_message = $('.status-message')
		$status_message.addClass('success')
		$status_message.html(status_message)
	}
}

function drawCalendar(events, dayshift=0, updated_string=null) {
	// you have to pass in the events you want to draw, but forecasts are automatically drawn if SHOW_WEATHER is true
	drawMonthAndYear(dayshift)
	drawWeekdays(dayshift)
	let blocks = events
	if (SHOW_WEATHER) blocks = blocks.concat(forecasts)
	drawBlocks(blocks, dayshift)
	drawStatus(events, updated_string)
}


/////////////////// OTHER FUNCTIONS ///////////////////
function onmessage(dic) {
	// defaults/fallback values
	let datetime_updated_string = null
	// get new values
	command	= dic['command']
	if (command === 'load-weather') {
		forecasts = dic['data']
	}
	else if (command === 'load-events') {
		events = dic['events']
		datetime_updated_string = dic['updated']
	}
	else {
		alert('Bad command.')
	}
	// draw calendar
	drawCalendar(events, dayshift, datetime_updated_string)
}

function updateWeatherLink() {
	// changes the weather link between 'show' and 'hide'
	let $link = $('#toggle-weather')
	if (SHOW_WEATHER) {
		$link.html('hide weather')
	} else {
		$link.html('show weather')
	}
}

function toggleWeather() {
	// Shows or hides the weather swatches
	if (SHOW_WEATHER) {
		$('.forecast').remove()
		SHOW_WEATHER = false
	} else {
		SHOW_WEATHER = true
		drawCalendar(events, dayshift)
	}
	updateWeatherLink()
}

function onshift(direction) {
	dayshift += direction * NUM_DAYS_TO_SHIFT
	drawCalendar(events, dayshift)
}

function onleftshift() {
	direction = -1
	onshift(direction)
}

function onrightshift() {
	direction = 1
	onshift(direction)
}

function initTriggers() {
	$('#shift-left').click(onleftshift)
	$('#shift-right').click(onrightshift)
	$('#toggle-weather').click(toggleWeather)
}

function initGlobals() {
	socket = new Socket(onmessage)
}

$(document).ready(function(){
	initGlobals()
	// preliminary calendar drawing (without events)
	drawCalendar(events)
	updateWeatherLink()
	initTriggers()
})
