module.exports = function() {
    return {
        basePath: '../',
        frameworks: ['mocha', 'sinon'],
        reporters: ['progress'],
        browsers: ['PhantomJS'],
        autoWatch: true,

        singleRun: false,
        colors: true,

        files: [
            // 3rd party code
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/momentjs/min/moment.min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-googleapi/src/angular-googleapi.js',
            'bower_components/angular-google-experiments/googleExperiments.min.js',
            'bower_components/angulartics/dist/angulartics.min.js',
            'bower_components/angulartics/dist/angulartics-ga.min.js',
            // app-specific code
            'public/javascripts/momentModule.js',
            'public/javascripts/app.js',
            'public/javascripts/InvoiceController.js',
            // test-specific code
            'node_modules/chai/chai.js',
            'tests/chai-assert.js'
        ]
    };
};
