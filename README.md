A program to share your google calendar publically/conveniently/beautifully with others.


[Demo](http://learnnation.org/schedule.html).


## Features
  * Display current and future events
  * Display actual event contents or have them simply say 'busy'

## Requested Features
  * Color swatches on each day to indicate the weather (for past days too) (specific color for each weather combination, etc)

## Installation


<<<<<<< HEAD
  * If you want to share your own calendars publically, read on...
  * Your calendar needs to be a Google Calendar
  * You need a google account and you need to set up API access through google
  * You will need a secrets file which Google will provide to you.
  * You will need a JavaScript enabled browser in order to grant access
  * OR you MIGHT BE ABLE TO USE THE --noauth_local_webserver option when kicking off the script.
  * You need Tornado installed since this is setup to run on the tornado server framework.  But the code could be easily altered to work on what you are comfortable with, such as Flask or Django.  If somebody requests the feature, I would be willing to rewrite everything in JavaScript so that no server is needed.
  * To build the CSS file from the SASS file, use compass or compass-for-gulp


  Take a look at view-source:math.virginia.edu/awm/calendar/ (in Opera).  I think it shows how to access the google calendar API through javascript.  That would probably solve our problem.

FOR GOOGLE API INFO:
https://developers.google.com/calendar/overview


look into: https://calendly.com/invitee_signup?invitee_uuid=DFDMQZIA2FYOBWPT
=======
  1. If you want to share your own calendars publically, read on...
  2. Your calendar needs to be a Google Calendar
  3. You need a google account and you need to set up API access through google
  4. You will need a secrets file which Google will provide to you.
  5. You will need a JavaScript enabled browser in order to grant access.  * You need Tornado installed since this is setup to run on the tornado server framework.  But the code could be easily altered to work on what you are comfortable with, such as Flask or Django.  If somebody requests the feature, I would be willing to rewrite everything in JavaScript so that no server is needed.
  6. To build the CSS file from the SASS file, use compass or compass-for-gul, or just manually copy the CSS file from somewhere else.
  7. install Google API client with `python3 /usr/bin/pip install --upgrade google-api-python-client` or similar.
  8. Finally, run server with `./main.py`.  Point browser to appropriate address.
  
## newfound success 1
Instead of trying to install a command line browser with javascript (basically impossible), install a GUI on the server (LXDE, or GNOME) and then connect to it via VNC.  Use Firefox.

    LXDE environment

## possible easier success
After installing, I got the message

    If your browser is on a different machine then exit and re-run this application with the command-line parameter

    --noauth_local_webserver

So yeah, that may do it.

