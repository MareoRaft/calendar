#!/usr/bin/env python3
import datetime
import json

from helpers import get_credentials, get_service
from event import Event

CAL_NAME_TO_ID = {
	'Away': 'e2r5nqkil48kbshsql3ke1c61c@group.calendar.google.com',
	'Events': 'mf1urita2cmb4omf980ibv7bp4@group.calendar.google.com',
	'Home': 'gtbqdl9o6cpntqvlgnjbr6k00c@group.calendar.google.com',
}
MAX_RESULTS_PER_CALENDAR = 200

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

def main(output='html'):
	service = get_service()
	events = get_events(service, cal_names=['Away', 'Home'])
	if output == 'svg':
		from cal_svg import init_drawing, draw_calendar
		d = init_drawing()
		draw_calendar(d, events)
		d.savePng('cal.png')
	elif output == 'html':
		# jinja me timbers
		pass

if __name__ == '__main__':
	main()
