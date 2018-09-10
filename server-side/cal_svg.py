import drawSvg as draw

# colors
BLUE = '#1248ff'
GREEN = '#0f8819'

# dimensions
COL_WIDTH = 164
BANNER_HEIGHT = 23
RIGHT_BUFFER = 40
HOUR_HEIGHT = 50
COL_HEIGHT = HOUR_HEIGHT * 13 # we only plan to show events from 10 am to 11 pm
TOTAL_WIDTH = COL_WIDTH * 7 + RIGHT_BUFFER
TOTAL_HEIGHT = COL_HEIGHT + BANNER_HEIGHT

def draw_event(d, event):
	# Monday is 0 and Sunday is 6
	start_x_pos = event.start_datetime().weekday() * COL_WIDTH
	start_y_pos = COL_HEIGHT - (event.start_hour_decimal() - 10) * HOUR_HEIGHT
	end_y_pos = COL_HEIGHT - (event.end_hour_decimal() - 10) * HOUR_HEIGHT
	height = event.hour_duration_decimal() * HOUR_HEIGHT
	rect = draw.Rectangle(
		start_x_pos, end_y_pos,
		COL_WIDTH, height,
		fill=GREEN)
	text = draw.Text(
		'busy',
		10,
		start_x_pos + 5, start_y_pos - 10,
		center=0,
		fill='white')
	d.append(rect)
	d.append(text)

def draw_days(d):
	for day_num, day_name in enumerate(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']):
		x_pos = day_num * COL_WIDTH
		r = draw.Rectangle(
			x_pos, COL_HEIGHT,
			COL_WIDTH, BANNER_HEIGHT,
			fill='black',
			stroke='white')
		t = draw.Text(
			day_name,
			10,
			x_pos + 5, COL_HEIGHT + 5,
			center=0,
			fill='white')
		d.append(r)
		d.append(t)

def draw_hours(d, show_lines=True):
	for hour in range(10, 23):
		suffix = 'AM' if hour < 12 else 'PM'
		prefix = hour if hour <= 12 else hour - 12
		hour_string = '{} {}'.format(prefix, suffix)
		x_pos = TOTAL_WIDTH - RIGHT_BUFFER + 3
		y_pos = COL_HEIGHT - (hour - 10) * HOUR_HEIGHT
		t = draw.Text(
			hour_string,
			10,
			x_pos, y_pos - 3,
			center=0,
			fill='black')
		d.append(t)
		if show_lines:
			l = draw.Lines(
				0, y_pos,
				TOTAL_WIDTH - RIGHT_BUFFER, y_pos,
				close=False,
				stroke='#444',
				stroke_width=0.5)
			d.append(l)

def draw_calendar(d, events):
	draw_hours(d)
	for event in events:
		draw_event(d, event)
	draw_days(d)

def init_drawing():
	d = draw.Drawing(TOTAL_WIDTH, TOTAL_HEIGHT)
	return d
