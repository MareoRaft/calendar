#!/usr/bin/env python3
from datetime import datetime

from weather import Weather, Unit

from config import CAL_NAME_TO_ID, MAX_RESULTS_PER_CALENDAR
from helpers import get_service
from event import Event

def get_weather():
	weather = Weather(unit=Unit.FAHRENHEIT)
	lookup = weather.lookup(22903)
	forecasts = lookup.forecast
	condition = lookup.condition
	data = [
		{'class': 'forecast', 'date': f.date, 'text': f.text} for f in forecasts
	]
	# TODO: clean the date of 'condition' so you can include it too (that's the forecast TODAY)
	# data.append({'class': 'forecast', 'date': condition.date, 'text': condition.text})
	return data

def get_events(service, cal_names=CAL_NAME_TO_ID.keys()):
	# record the time that we get the events
	dt_retrieved = datetime.now()
	# get events
	events = []
	for cal_name in cal_names:
		cal_id = CAL_NAME_TO_ID[cal_name]
		now = datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
		eventsResult = service.events().list(
			calendarId=cal_id,
			timeMin=now,
			maxResults=MAX_RESULTS_PER_CALENDAR,
			singleEvents=True,
			orderBy='startTime'
		).execute()
		events += eventsResult.get('items', [])
	events = [Event(e) for e in events]
	# order events
	events = sorted(events, key=lambda e: e.start_datetime())
	# return
	return (events, dt_retrieved)

def output(out_format='html'):
	if out_format == 'svg':
		from cal_svg import init_drawing, draw_calendar
		d = init_drawing()
		draw_calendar(d, events)
		d.savePng('cal.png')
	elif out_format == 'html':
		# jinja me timbers
		pass

def main():
	# setup
	global service
	service = get_service()
	global events
	events = get_events(service, cal_names=['Away', 'Home'])
	# output
	output()

if __name__ == '__main__':
	main()
