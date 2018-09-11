A program to share your google calendar publically/conveniently/beautifully with others.


[Demo](http://learnnation.org/schedule.html).


## Features

  * Display current and future events
  * Display actual event contents or have them simply say 'busy'
  * Color swatches on each day to indicate the weather (specific color for each weather combination, etc)

## Requested Features

  * ability to turn color weather swatches on/off
  * create a Docker for this project, because google-api-python-client and oauth2client are so finicky
  * change today num highlight color, check out: https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement#11978996

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
