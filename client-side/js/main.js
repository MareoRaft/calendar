// once we finish writing in python, we will then translate that to JS, so that a new request to the server won't need to be made every time the user wants to view more info on the calendar.
// Define websocket to be used for server interaction

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


//////////////////// GLOBALS ////////////////////
let socket = undefined


/////////////////// FUNCTIONS ///////////////////

function onmessage(dic) {
	command	= dic['command']
	if (command === 'co') {
		alert('got co!')
	}
}



//stuff

function initGlobals() {
	socket = new Socket(onmessage)
}

$(document).ready(function(){
	initGlobals()


	alert('hi')



})
