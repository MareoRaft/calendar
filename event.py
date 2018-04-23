from datetime import datetime
import json

def string_to_datetime(dt_str):
	dt_str_head = dt_str[:-6]
	dt_str_tail = dt_str[-6:]
	dt = datetime.strptime(dt_str_head, '%Y-%m-%dT%H:%M:%S')
	assert isinstance(dt, datetime)
	return dt

def hour_decimal(dt):
	""" For example, the time 12:45 becomes 12.75 """
	return dt.hour + dt.minute/60


class Event:
	def __init__(self, event):
		self.event = event

	def start_datetime(self):
		dt_str = self.event['start'].get('dateTime')
		dt = string_to_datetime(dt_str)
		return dt

	def start_hour_decimal(self):
		return hour_decimal(self.start_datetime())

	def end_datetime(self):
		dt_str = self.event['end'].get('dateTime')
		dt = string_to_datetime(dt_str)
		return dt

	def end_hour_decimal(self):
		if self.end_datetime().day > self.start_datetime().day: # just a patch for events that go multiple days.  this probably should be changed if this program gets more serious in the future
			return 24
		else:
			return hour_decimal(self.end_datetime())

	def hour_duration_decimal(self):
		return self.end_hour_decimal() - self.start_hour_decimal()

	def text(self):
		return self.event['summary']

	def __repr__(self):
		return json.dumps(self.event)

	def as_dict_for_javascript(self):
		d = {
			'hour_duration': self.hour_duration_decimal(),
			'start_hour_decimal': self.start_hour_decimal(),
			'weekday': self.start_datetime().weekday(),
			'text': self.text(),
		}
		return d
