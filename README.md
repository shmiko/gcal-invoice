gcal-invoice
============

[![Build Status](https://travis-ci.org/omouse/gcal-invoice/.svg)](https://travis-ci.org/omouse/gcal-invoice)
[![Codacy Badge](https://api.codacy.com/project/badge/fef705d0205e4abb92efd1c3f8554d7a)](https://www.codacy.com/app/omouse/gcal-invoice)

invoice based on google calendar events, select the events, it will
calculate hours per day and give you a CSV invoice

this is a single-page web application using AngularJS

## Setup

Install the packages required:

    npm install

Create a Google API token that has permissions for user email and calendar. Make sure the origin website matches where you will be hosting the site.

Change the API token in `public/javascripts/app.js` on the line that says `clientId`:

    .config(function(googleLoginProvider) {
        googleLoginProvider.configure({
            clientId: 'API-TOKEN-GOES-HERE',
            scopes: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/calendar'
            ]
        });
    })

Compile the CSS files:

    grunt less

Run the unit tests:

    grunt test

To lint the javascript files using jshint and jscs, you can do this:

    grunt lint

## Usage

Run the server:

    node app

Check it out in the web browser: http://localhost:3003/

If you're using cloud9 IDE, it will supply the IP and PORT through environment variables.
