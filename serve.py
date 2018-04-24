#!/usr/bin/env python3
import datetime
import json
from os import path

from tornado.web import RequestHandler
from tornado.web import RedirectHandler
from tornado.web import StaticFileHandler
from tornado.websocket import WebSocketHandler
from tornado.web import Application
from tornado.web import url
from tornado.ioloop import IOLoop
from tornado.log import enable_pretty_logging

from helpers import get_credentials, get_service
from event import Event

CLIENT_SIDE_DIRECTORY_PATH = "client-side/"
PORT_NUMBER = 8811
MAX_RESULTS_PER_CALENDAR = 200
CAL_NAME_TO_ID = {
	'Away': 'e2r5nqkil48kbshsql3ke1c61c@group.calendar.google.com',
	'Events': 'mf1urita2cmb4omf980ibv7bp4@group.calendar.google.com',
	'Home': 'gtbqdl9o6cpntqvlgnjbr6k00c@group.calendar.google.com',
}

def get_events(service, cal_names=CAL_NAME_TO_ID.keys()):
	# get events
	events = []
	for cal_name in cal_names:
		cal_id = CAL_NAME_TO_ID[cal_name]
		now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
		in_one_week = (datetime.datetime.utcnow() + datetime.timedelta(weeks=1)).isoformat() + 'Z'
		eventsResult = service.events().list(
			calendarId=cal_id,
			timeMin=now,
			timeMax=in_one_week,
			maxResults=MAX_RESULTS_PER_CALENDAR,
			singleEvents=True,
			orderBy='startTime'
		).execute()
		events += eventsResult.get('items', [])
	events = [Event(e) for e in events]
	# order events
	events = sorted(events, key=lambda e: e.start_datetime())
	# return
	return events


class SocketHandler (WebSocketHandler):


	def open(self):
		print('websocket opened!')
		# send them events
		js_events = [e.as_dict_for_javascript() for e in events]
		self.write_message({
			'command': 'co',
			'events': js_events,
		})

	def on_message(self, message):
		# Convert things to be more friendly.  Check for good input.
		assert type(message) in [str, unicode]
		print('got message: {}'.format(message))
		message_dict = json.loads(message)
		assert type(message_dict) == dict
		# Check to ensure a command is received
		if "command" not in message_dict:
			raise KeyError("Key 'command' is missing. Bad.")
		command	= message_dict["command"]

		# Obey command
		# if command == ...
		# self.write_message({
		# 	'command': command,
		# 	'data': data,
		# })

	def on_close(self):
		print('websocket closed')


class JSSocketHandler (RequestHandler):
	""" This is to render socket.js, passing in the host url """


	def get(self):
		self.render(path.join(CLIENT_SIDE_DIRECTORY_PATH, "socket.js"), host=self.request.host)


def make_app():
	return Application(
		[
			url(r'/mySocket', SocketHandler, {} , name = "a"),
			url(r'/socket\.js', JSSocketHandler, {}, name = "b"),
			url(r'/?', RedirectHandler, { "url": "index.html" }),
			url(r'/(.*)', StaticFileHandler, { "path": CLIENT_SIDE_DIRECTORY_PATH }) # captures anything at all, and serves it as a static file. simple!
		],
		#settings
		debug = True,
	)

def main():
	# get calendar info
	global service
	service = get_service()
	global events
	events = get_events(service, cal_names=['Away', 'Home'])
	# kickoff server
	enable_pretty_logging()
	application = make_app()
	application.listen(PORT_NUMBER)
	IOLoop.current().start()

if __name__ == "__main__":
	main()
