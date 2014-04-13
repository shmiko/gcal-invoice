angular.module('gcalInvoice').controller(
    'InvoiceController',
    ['$scope', 'googleLogin', 'googleCalendar',
     function($scope, googleLogin, googleCalendar) {
         var dateFormatRfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
         $scope.getMomentFromGCalDateTime = function(dateString) {
             return moment.utc(dateString, dateFormatRfc3339);
         };
         $scope.selectedEvents = [];
         $scope.invoice = {
             hourlyRate: 40.0,
             lineItems: []
         };
         $scope.loggedIn = false;
         $scope.calendars = [];
         $scope.selectedCalendar = null;
         $scope.events = [];
         $scope.months = ['January', 'February', 'March', 'April', 'May',
                          'June', 'July', 'August', 'September', 'October',
                          'November', 'December'];
         $scope.years = [2013, 2014, 2015];
         $scope.startMonth = null;
         $scope.startYear = null;
         $scope.endMonth = null;
         $scope.endYear = null;

         $scope.login = function() {
             googleLogin.login().then(function() {
                 $scope.loggedIn = true;
             });
         };

         $scope.$on('googleCalendar:loaded', function() {
             googleCalendar.listCalendars().then(function(calendars) {
                 $scope.calendars = calendars;
             });
         });

         $scope.selectCalendarAndFilterEvents = function() {
             var params = { calendarId: $scope.selectedCalendar };
             if ($scope.startYear) {
                 if ($scope.startMonth) {
                     params.timeMin = moment($scope.startMonth + ' ' + $scope.startYear, 'MMMM YYYY').startOf('month');
                 } else {
                     params.timeMin = moment($scope.startYear, 'YYYY').startOf('year');
                 }
                 params.timeMin = params.timeMin.format(dateFormatRfc3339);
             }
             if ($scope.endYear) {
                 if ($scope.endMonth) {
                     params.timeMax = moment($scope.endMonth + ' ' + $scope.endYear, 'MMMM YYYY').endOf('month');
                 } else {
                     params.timeMax = moment($scope.endYear, 'YYYY').endOf('year');
                 }
                 params.timeMax = params.timeMax.format(dateFormatRfc3339);
             }
             if ($scope.selectedCalendar) {
                 googleCalendar.listEvents(params).then(function(events) {
                     $scope.events = events;
                 });
             }
         };

         $scope.addEventToSelected = function(event) {
             $scope.selectedEvents.push(event);
         };

         $scope.updateInvoice = function() {
             var lineItem;
             var key;
             var keys = [];
             var dates = {};
             $scope.invoice.lineItems = [];
             // group the events by their date
             angular.forEach($scope.selectedEvents, function(event, index) {
                 var startDateTime = $scope.getMomentFromGCalDateTime(event.start.datetime);
                 var day = startDateTime.format('YYYY-MM-DD');
                 if (angular.isUndefined(dates[day])) {
                     dates[day] = [];
                 }
                 dates[day].push(event);
             });
             // sort the keys so we can do this in sorted order
             for (key in dates) {
                 if (dates.hasOwnProperty(key)) {
                     keys.push(key);
                 }
             }
             keys.sort();
             // create the invoice line items (in sorted order)
             for (key in keys) {
                 lineItem = {
                     date: keys[key],
                     description: [],
                     hoursWorked: 0.0,
                     hourlyRate: $scope.invoice.hourlyRate,
                     discount: 0.0
                 };
                 angular.forEach(dates[keys[key]], function(event, index) {
                     startDateTime = $scope.getMomentFromGCalDateTime(event.start.datetime);
                     endDateTime = $scope.getMomentFromGCalDateTime(event.end.datetime);
                     duration = moment.duration(endDateTime.diff(startDateTime));
                     lineItem.hoursWorked += duration.asHours();

                     if (lineItem.description.indexOf(event.description) === -1) {
                         lineItem.description.push(event.description);
                     }
                 });
                 lineItem.description = lineItem.description.join(', ');
                 $scope.invoice.lineItems.push(lineItem);
             }
         };
     }
    ]
);
