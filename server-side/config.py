CLIENT_SIDE_DIRECTORY_PATH = "../client-side/"
PORT_NUMBER = 8811
# Whether to show only 'busy' on each event.  Can be "true" or "false".
PRIVACY = "true"
# Whether to show weather color swatches at all.  Can be "true" or "false".
SHOW_WEATHER = "false"
# Whether to show *text* at the top of each day saying the weather forecast.  Can be "true" or "false".
SHOW_WEATHER_TEXT = "true"
# How many events into the future to request from google, per calendar.
MAX_RESULTS_PER_CALENDAR = 200
CAL_NAME_TO_ID = {
	'Away': 'e2r5nqkil48kbshsql3ke1c61c@group.calendar.google.com',
	'Events': 'mf1urita2cmb4omf980ibv7bp4@group.calendar.google.com',
	'Home': 'gtbqdl9o6cpntqvlgnjbr6k00c@group.calendar.google.com',
}
# The calendars you want to actually appear on the website.
CAL_NAMES = ['Away', 'Home']
# How often the daemon should ping google to update the calendar events, in minutes.  (Note that the website will NOT refresh it's view of the databases's most recent events unless the user manually refreshes it.)
EVENT_DAEMON_REFRESH_RATE = 5
