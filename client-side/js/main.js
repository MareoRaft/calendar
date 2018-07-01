//This is a TEMPLATE (notice the "{{privacy}}" variable drop-in).
// once we finish writing in python, we will then translate that to JS, so that a new request to the server won't need to be made every time the user wants to view more info on the calendar.
// Define websocket to be used for server interaction

//////////////////// GLOBALS ////////////////////
let socket = undefined
let HOUR_HEIGHT = 54
let PRIVACY = {{privacy}}
let SHOW_WEATHER_TEXT = {{show_weather_text}}
let dayshift = 0
let forecasts = []
let events = []
let NUM_DAYS_TO_SHIFT = 1
let forecast_text_to_colors = {
	'Cloudy': ['#888888', '#121212'],
	'Partly Cloudy': ['#99AACC', '#041C3A'],
	'Mostly Cloudy': ['#AAAAAA', '#202020'],
	'Rain': ['#0055AA', '#000520'],
	'Sunny': ['#FFFF44', '#343401'],
	'Mostly Sunny': ['#EEFF99', '#304409'],
	'Clear': ['#0080FF', '#001034'],
	'Mostly Clear': ['#0080D0', '#001028'],
	'Thunderstorms': ['#444400', '#010100'],
	'Scattered Thunderstorms': ['#666644', '#0A0A01'],
}


///////////////// DRAW FUNCTIONS /////////////////
// all of the draw functions also ERASE/REPLACE previously things drawn
function drawMonthAndYear(dayshift=0) {
	let date = Date.today().add({ days: dayshift })
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
		let date = Date.today().add({ days: dayshift + daychange })
		weekdates.push(date)
	}
	return weekdates
}

function drawWeekday(datetime, slot_num) {
	// slot_num is the number of the column where to draw the weekday and daynumber in month
	let weekday = datetime.getWeekdayName()
	let weekday_short = weekday.slice(0, 3)
	let day_num = datetime.getDate()
	let weekday_slug = weekday_short + ' ' + day_num
	// put the info in the slot
	let id = "weekday-slot-" + slot_num
	$('#' + id).html(weekday_slug)
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
	let $f = $('<div/>', {class: 'event', text: text})
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
	let top = event['start_hour_decimal'] * HOUR_HEIGHT
	let height = event['hour_duration'] * HOUR_HEIGHT
	let text = PRIVACY? 'busy': event['text']
	// add to HTML
	let insertion_id = 'weekday-' + column_index
	let $event = $('<div/>', {class: 'event', text: text})
	$('#' + insertion_id).append($event)
	$event.css({
		'top': '' + top + 'px',
		'height': '' + height + 'px',
	})
}

function drawBlock(block, dayshift) {
	// verify that block falls in the correct timeframe!
	let weekdates_to_draw = getWeekdatesToDraw(dayshift)
	let block_date = Date.parse(block['date'])
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

function drawStatus(events) {
	if (events.length > 0) {
		// hide the 'loading' icon
		$('.status-message').hide()
	}
}

function drawCalendar(events, dayshift=0) {
	drawMonthAndYear(dayshift)
	drawWeekdays(dayshift)
	let blocks = events.concat(forecasts)
	drawBlocks(blocks, dayshift)
	drawStatus(events)
}


/////////////////// OTHER FUNCTIONS ///////////////////
function onmessage(dic) {
	command	= dic['command']
	if (command === 'populate-weather') {
		forecasts = dic['data']
	}
	else if (command === 'populate-events') {
		events = dic['events']
	}
	else {
		alert('Bad command.')
	}
	drawCalendar(events, dayshift)
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
}

function initGlobals() {
	socket = new Socket(onmessage)
}

$(document).ready(function(){
	initGlobals()
	// preliminary calendar drawing (without events)
	drawCalendar(events)
	initTriggers()
})
