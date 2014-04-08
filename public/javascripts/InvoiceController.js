angular.module('gcalInvoice').controller(
    'InvoiceController',
    ['$scope', 'googleLogin', 'googleCalendar',
     function($scope, googleLogin, googleCalendar) {
         $scope.loggedIn = false;
         $scope.login = function() {
             googleLogin.login();
             $scope.loggedIn = true;
         };
     }
    ]
);
