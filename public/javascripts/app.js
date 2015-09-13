/* global angular */
angular.module('gcalInvoice', ['ngRoute', 'googleApi', 'momentjs', 'googleExperiments', 'angulartics', 'angulartics.google.analytics'])
    .config(function(googleExperimentsProvider) {
        googleExperimentsProvider.configure({
            experimentId: 'JgFjWSjwQ7WiHxgBjY0CnQ'
        });
    })
    .config(function(googleLoginProvider) {
        googleLoginProvider.configure({
            clientId: '141159713889-6t2m78ce3fl53duingebjplpm26e861f.apps.googleusercontent.com',
            scopes: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/calendar'
            ]
        });
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/main.html',
                controller: 'InvoiceController'
            })
            .when('/login/', {
                templateUrl: '/partials/main.html',
                controller: 'InvoiceController'
            })
            .otherwise({ redirectTo: '/' });
    });
