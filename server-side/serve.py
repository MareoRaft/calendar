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

from config import PORT_NUMBER, CLIENT_SIDE_DIRECTORY_PATH, PRIVACY, SHOW_WEATHER, SHOW_WEATHER_TEXT
from main import get_weather
import db


class SocketHandler (WebSocketHandler):


	def open(self):
		print('websocket opened!')
		# send them weather
		if SHOW_WEATHER:
			weather = get_weather()
			self.write_message({
				'command': 'populate-weather',
				'data': weather,
			})
		# send them events
		(js_events, js_datetime_retrieved) = db.get_js_events()
		self.write_message({
			'command': 'populate-events',
			'events': js_events,
			'updated': js_datetime_retrieved,
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
		self.render(path.join(CLIENT_SIDE_DIRECTORY_PATH, "js/socket.js"), host=self.request.host)


class JSMainHandler (RequestHandler):
	""" This is to render main.js, passing in config options """


	def get(self):
		self.render(path.join(CLIENT_SIDE_DIRECTORY_PATH, "js/main.js"), privacy=PRIVACY, show_weather_text=SHOW_WEATHER_TEXT)


def make_app():
	return Application(
		[
			url(r'/mySocket', SocketHandler),
			url(r'/js/socket\.js', JSSocketHandler),
			url(r'/js/main\.js', JSMainHandler),
			url(r'/?', RedirectHandler, { "url": "index.html" }),
			url(r'/(.*)', StaticFileHandler, { "path": CLIENT_SIDE_DIRECTORY_PATH }),
		],
		# settings
		debug = True,
	)

def server_kickoff():
	enable_pretty_logging()
	application = make_app()
	application.listen(PORT_NUMBER)
	IOLoop.current().start()

def main():
	# setup
	# kickoff server
	server_kickoff()

if __name__ == "__main__":
	main()
