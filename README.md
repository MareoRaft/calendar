A program to share your google calendar publically/conveniently/beautifully with others.


[Demo](http://learnnation.org/schedule.html).


## Features

  * Display current and future events
  * Display actual event contents or have them simply say 'busy'
  * Color swatches on each day to indicate the weather (for past days too) (specific color for each weather combination, etc)

## Requested Features

  * ability to turn color weather swatches on/off
  * create a Docker for this project, because google-api-python-client and oauth2client are so finicky

## Installation

  1. Your calendar needs to be a Google Calendar
  2. You need a google account and you need to set up API access through google (https://developers.google.com/calendar/overview)
  3. You will need a secrets file which Google will provide to you.
  4. Kick off the python script with the `--noauth_local_webserver` option, so google will not require you to login via a browser
  5. You need Tornado installed since this is setup to run on the tornado server framework.  But the code could be easily altered to work on what you are comfortable with, such as Flask or Django.  If somebody requests the feature, I would be willing to rewrite everything in JavaScript so that no server is needed.
  6. To build the CSS file from the SASS file, use compass or compass-for-gulp, or just manually copy the CSS file from somewhere else.
  7. install Google API client with `python3 /usr/local/bin/pip install --upgrade google-api-python-client` or similar.
  8. Finally, run server with `./serve.py --noauth_local_webserver`.  Point browser to appropriate address.
