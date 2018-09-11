#!/usr/bin/env python3
""" This daemon repeatedly pings the google server to get the most up-to-date calendar info, and stores the info in MongDB. """
import time

from helpers import get_service
from main import get_events
from config import CAL_NAMES, EVENT_DAEMON_REFRESH_RATE
import db

def get_events_and_update_db():
	# get events from google
	global service
	(events, datetime_retrieved) = get_events(service, cal_names=CAL_NAMES)
	# put them in the database
	db.set_events(events, datetime_retrieved)

def main():
	# setup
	global service
	service = get_service()
	# run repeatedly
	while True:
		get_events_and_update_db()
		print('updated db')
		time.sleep(60 * EVENT_DAEMON_REFRESH_RATE)

if __name__ == "__main__":
	main()
