# calendar

A program to share your google calendar publically/conveniently/beautifully with others.  Host a read-only version of your calendar on the web.


[Demo](http://learnnation.org/calendar.html).


## Features

  * Display current and future events
  * Display actual event contents or have them simply say 'busy'
  * Color swatches on each day to indicate the weather (specific color for each weather combination, etc)
  * ability to turn color weather swatches on/off
  * time zone support: automatically shows all times in the time zone according to the browser's locale

## Requested Features

  * create a Docker for this project, because google-api-python-client and oauth2client are so finicky

## Installation

  1. You need MongoDB installed.
  2. Your calendar needs to be a Google Calendar
  3. You need a google account and you need to set up API access through google (https://developers.google.com/calendar/overview)
  4. You will need a secrets file which Google will provide to you.
  5. To build the CSS file from the SASS file, use compass or compass-for-gulp, or just manually copy the CSS file from somewhere else.
  6. On python3 install everything in `requirements.txt`
  7. On python3 install Google API client with `python3 /usr/local/bin/pip install --upgrade google-api-python-client` or similar, then install `oauth2client` too.  When the script runs, it will complain but still work.
  8. Run the daemon with `./events_daemon.py --noauth_local_webserver` to keep events up to date.
  9. Run the server with `./serve.py --noauth_local_webserver`.  Point browser to appropriate address.

## Alternative

Instead of using this, you can share your google calendars publically and have google do the hard work for you.  It's not as pretty, but it won't break when google changes their API every year.

Read [here](https://support.google.com/calendar/answer/37083#zippy=%2Cembed-your-calendar-on-a-website%2Cshare-it-with-a-certain-person%2Cshare-as-a-link) for directions on making your calendar public, then add `src=<Calendar ID>` to the URL for each calendar that you want to appear.  My Calendar IDs are...

  * mvlancellotti%40gmail.com
  * e2r5nqkil48kbshsql3ke1c61c%40group.calendar.google.com
  * mf1urita2cmb4omf980ibv7bp4%40group.calendar.google.com
  * gtbqdl9o6cpntqvlgnjbr6k00c%40group.calendar.google.com
  * ihtu7s8srctam6tg8253gssu1c%40group.calendar.google.com
  * p651eedige1fk0sf7770kb9i5s%40group.calendar.google.com

so the URL that allows you to see them all together is

https://calendar.google.com/calendar/embed?mode=WEEK&showTitle=0&src=mvlancellotti%40gmail.com&src=e2r5nqkil48kbshsql3ke1c61c%40group.calendar.google.com&src=mf1urita2cmb4omf980ibv7bp4%40group.calendar.google.com&src=gtbqdl9o6cpntqvlgnjbr6k00c%40group.calendar.google.com&src=ihtu7s8srctam6tg8253gssu1c%40group.calendar.google.com&src=p651eedige1fk0sf7770kb9i5s%40group.calendar.google.com

See [here](https://calendar.google.com/calendar/u/0/embedhelper?src=r7b194fm80hc7ff0m5jouupil0%40group.calendar.google.com&ctz=America%2FNew_York) also for customizing the view, and the time zone.




