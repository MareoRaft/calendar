import pymongo

from mongo import Mongo

## Create global db object (technically, it's a MongoDB cursor)
DB = Mongo('calendar', 'events')
QUERY = { '_id': 'unique' }

def get_js_events():
	data_dic = DB.find_one(QUERY)
	js_events = data_dic['js_events']
	js_datetime_retrieved = data_dic['js_datetime_retrieved']
	return (js_events, js_datetime_retrieved)

def set_events(events, datetime_retrieved):
	js_events = [e.as_dict_for_javascript() for e in events]
	js_datetime_retrieved = datetime_retrieved.strftime('%Y-%m-%dT%H:%M:%S')
	# create the dictionary for input
	data_dic = {
		'js_events': js_events,
		'js_datetime_retrieved': js_datetime_retrieved,
	}
	data_dic.update(QUERY)
	# insert (the first time) or update (forever after) the data
	DB.upsert(QUERY, data_dic)

