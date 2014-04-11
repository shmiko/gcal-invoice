angular.module('gcalInvoice').controller(
    'InvoiceController',
    ['$scope', 'googleLogin', 'googleCalendar',
     function($scope, googleLogin, googleCalendar) {
         $scope.loggedIn = false;
         $scope.events = [];
         $scope.login = function() {
             googleLogin.login();
             $scope.loggedIn = true;
         $scope.selectCalendar = function(calendarId) {
             googleCalendar.listEvents({
                 calendarId: calendarId
             }).then(function(events) {
                 $scope.events = events;
             });
         };
     }
    ]
);
