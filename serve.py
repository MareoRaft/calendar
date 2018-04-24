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

from config import PORT_NUMBER, CLIENT_SIDE_DIRECTORY_PATH
from helpers import get_service
from main import get_events, update_events


class SocketHandler (WebSocketHandler):


	def open(self):
		print('websocket opened!')
		# make sure events are up-to-date
		update_events()
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
			url(r'/js/socket\.js', JSSocketHandler, {}, name = "b"),
			url(r'/?', RedirectHandler, { "url": "index.html" }),
			url(r'/(.*)', StaticFileHandler, { "path": CLIENT_SIDE_DIRECTORY_PATH }) # captures anything at all, and serves it as a static file. simple!
		],
		#settings
		debug = True,
	)

def server_kickoff():
	enable_pretty_logging()
	application = make_app()
	application.listen(PORT_NUMBER)
	IOLoop.current().start()

def main():
	# get calendar info
	global service
	service = get_service()
	global events
	update_events()
	# kickoff server
	server_kickoff()

if __name__ == "__main__":
	main()
