angular.module('gcalInvoice').controller(
    'InvoiceController',
    ['$scope', 'googleLogin', 'googleCalendar',
     function($scope, googleLogin, googleCalendar) {
         $scope.loggedIn = false;
         $scope.calendars = [];
         $scope.selectedCalendar = null;
         $scope.events = [];
         $scope.selectedEvents = [];
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
             var dateFormatRfc3339 = 'YYYY-MM-DDTHH:mm:ssZ';
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

     }
    ]
);
