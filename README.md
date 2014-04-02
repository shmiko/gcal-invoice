gcal-invoice
============

invoice based on google calendar events, select the events, it will
calculate hours per day and give you a CSV invoice

Dependencies:

* [Node-CSV](http://www.adaltas.com/projects/node-csv/)
* [google-calendar](https://github.com/wanasit/google-calendar)

## Usage

## Example

Here's an example of how a typical usage session will look like:

    node gcal-invoice
    Enter your Google account information
    Username: example@gmail.com
    Password:
    
    Calendars
    0) My Calendar
    1) My Work Calendar
    Which calendar to use? 1
    
    Title of events? work
    
    Events selected:
    March 1, 2014: 9am - 12pm
    March 1, 2014: 1pm - 5pm
    March 2, 2015: 9am - 10:30am
    March 2: 2015: 10:45am - 11:00am
    
    Hourly rate? 20
    
    CSV filename? march2014-invoice.csv
    Generated invoice: march2014-invoice.csv

The generated CSV will look like this (with a $20/hr rate):

    DATE,HOURS,PRICE
    1 March 2014,7,140.0
    2 March 2014,1.75,35.0
