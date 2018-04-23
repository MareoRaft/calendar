// once we finish writing in python, we will then translate that to JS, so that a new request to the server won't need to be made every time the user wants to view more info on the calendar.
// Define websocket to be used for server interaction

//////////////////// GLOBALS ////////////////////
let socket = undefined
let HOUR_HEIGHT = 54
let PRIVACY = false
let dayshift = 0
let events = []
let NUM_DAYS_TO_SHIFT = 1


//////////////////// CLASSES ////////////////////
class Socket { // manually extend WebSocket, because WebSocket didn't want to use "super"

	constructor(onmessage_func) {
		this.ws = new WebSocket("ws://localhost:8811/mySocket")
		this.ws.socket = this
		this.ws.onmessage = function(event) {
			// Convert things to be more friendly.  Check for good input.
			let dic = JSON.parse(event.data)
			if ('message' in dic) {
				message = dic['message']
				console.log('got message: ' + message)
			}
			// Check to ensure a command is received
			if (!('command' in dic)) {
				console.log("Key 'command' is missing. It is mandatory!")
			}
			return onmessage_func(dic)
		}
		// Once the socket is successfully open, try to login
		this.ws.onopen = function(event) {
			// do stuff
		}
	}

	send(outData) {
		// Send data through websocket
		// outData: object to be translated into a string for websocket transfer
		let outDataStr = JSON.stringify(outData)
		this.ws.send(outDataStr)
	}
}


/////////////////// DRAW FUNCTIONS ///////////////////
// all of the draw functions also ERASE/REPLACE previously things drawn
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
	for (let daychange = 0; daychange < 7; daychange++) {
		// we are using Date.js (www.datejs.com) to shift the day
		date = Date.today().add({ days: dayshift + daychange })
		drawWeekday(date, daychange)
	}
}

function drawEvent(event) {
	// TODO: verify that event falls in the correct timeframe!
	let weekday = event['weekday']
	let top = event['start_hour_decimal'] * HOUR_HEIGHT
	let height = event['hour_duration'] * HOUR_HEIGHT
	let text = PRIVACY? 'busy': event['text']

	// do some day logic here
	let weekday_id = 'weekday-' + weekday
	// add to HTML
	let $event = $('<div/>', {class: 'event', text: text})
	$('#' + weekday_id).append($event)
	$event.css('top', '' + top + 'px')
	$event.css('height', '' + height + 'px')
}

function drawEvents(events) {
	// erase events already on calendar
	$('.content-of-weekday').html('')
	// draw each event on the calendar
	for (event of events) {
		drawEvent(event)
	}
}

function drawCalendar(events, dayshift=0) {
	// draw the month and year

	// TODO:
	// get NOW
	// add dayshift
	// retrieve month and year
	// update .month-and-year

	// draw days of week on calendar
	drawWeekdays(dayshift)
	drawEvents(events)
}

/////////////////// OTHER FUNCTIONS ///////////////////
function onmessage(dic) {
	command	= dic['command']
	if (command === 'co') {
		events = dic['events']
		drawCalendar(events, dayshift)
	}
}

function on_shift(direction) {
	dayshift += direction * NUM_DAYS_TO_SHIFT
	drawCalendar(events, dayshift)
}

function on_left_shift() {
	direction = -1
	on_shift(direction)
}

function on_right_shift() {
	direction = 1
	on_shift(direction)
}

function initGlobals() {
	socket = new Socket(onmessage)
}

$(document).ready(function(){
	initGlobals()
	$('#shift-left').click(on_left_shift)
	$('#shift-right').click(on_right_shift)
})
