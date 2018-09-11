import pymongo

from mongo import Mongo

## Create global db object
db = Mongo('schedule', 'events')

def get_events():
	events = db.find_one(find_dic)
	# events_datetime_retrieved = db.find_one()
	events_datetime_retrieved = 'saturday'
	return (events, events_datetime_retrieved)

def get_js_events():
	(events, events_datetime_retrieved) = get_events()
	js_events = [e.as_dict_for_javascript() for e in events]
	js_events_datetime_retrieved = events_datetime_retrieved.strftime('%Y-%m-%dT%H:%M:%S')
	return (js_events, js_events_datetime_retrieved)

def set_events(events):
	db.upsert(events)

