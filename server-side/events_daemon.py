#!/usr/bin/env python3
""" This daemon repeatedly pings the google server to get the most up-to-date calendar info, and stores the info in MongDB. """
import time

from helpers import get_service
from main import get_events
from config import CAL_NAMES, EVENT_DAEMON_REFRESH_RATE
import db

def get_events_and_update_db():
	# get events from google
	# it seems the google service connection was expiring, so we'll try getting a fresh service each time:
	(events, datetime_retrieved) = get_events(get_service(), cal_names=CAL_NAMES)
	# put them in the database
	db.set_events(events, datetime_retrieved)

def main():
	# run repeatedly
	while True:
		try:
			get_events_and_update_db()
			print('updated db')
		except:
			# if you hit an error, wait extra time before trying again
			time.sleep(60 * 2 * EVENT_DAEMON_REFRESH_RATE)
		get_events_and_update_db()
		print('updated db')
		time.sleep(60 * EVENT_DAEMON_REFRESH_RATE)

if __name__ == "__main__":
	main()
