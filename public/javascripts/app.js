angular.module('gcalInvoice', ['ngRoute', 'googleApi'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'public/partials/main.html',
                controller: 'InvoiceController'
            })
            .otherwise({ redirectTo: '/main' });
    });
