A program to share your google calendar publically/conveniently/beautifully with others.


[Demo](http://learnnation.org/schedule.html).


## Features
  * Display current and future events
  * Display actual event contents or have them simply say 'busy'

## Requested Features
  * Color swatches on each day to indicate the weather (for past days too) (specific color for each weather combination, etc)

## Installation

Edbrowse might work, but we'll need to do it on my OTHER server, since pkg doesn't work right on the old FreeBSD.  Maybe the cherry server is best!

http://edbrowse.org



  * If you want to share your own calendars publically, read on...
  * Your calendar needs to be a Google Calendar
  * You need a google account and you need to set up API access through google
  * You will need a secrets file which Google will provide to you.
  * You will need a JavaScript enabled browser in order to grant access.  * You need Tornado installed since this is setup to run on the tornado server framework.  But the code could be easily altered to work on what you are comfortable with, such as Flask or Django.  If somebody requests the feature, I would be willing to rewrite everything in JavaScript so that no server is needed.
  * To build the CSS file from the SASS file, use compass or compass-for-gulp
  * Finally, run server with ./main.py.  Point browser to appropriate address.
  
