angular.module('gcalInvoice').controller(
    'InvoiceController',
    ['$scope', 'googleLogin', 'googleCalendar',
     function($scope, googleLogin, googleCalendar) {
         var selectCalendarAndFilterEvents = function() {
             console.log('updating listed events');
         };

         $scope.loggedIn = false;
         $scope.calendars = [];
         $scope.selectedCalendar = null;
         $scope.events = [];
         $scope.selectedEvents = [];
         $scope.months = ['January', 'February', 'March', 'April', 'May',
                          'June', 'July', 'August', 'September', 'October',
                          'November', 'December'];
         $scope.years = [2013, 2014, 2015];

         $scope.login = function() {
             googleLogin.login().then(function() {
                 $scope.loggedIn = true;
             });
         };

         $scope.selectCalendar = function(calendarId) {
             googleCalendar.listEvents({
                 calendarId: calendarId
             }).then(function(events) {
                 $scope.events = events;
             });
         };

         $scope.$on('googleCalendar:loaded', function() {
             googleCalendar.listCalendars().then(function(calendars) {
                 $scope.calendars = calendars;
             });
         });
     }
    ]
);
