var baseConfig = require('./karma-base.conf.js');

module.exports = function(config) {
    var conf = baseConfig();
    conf.files = conf.files.concat([
        // extra testing code
        'bower_components/angular-mocks/angular-mocks.js',
        // mocha stuff
        'tests/mocha.conf.js',
        // test files
        './tests/unit/**/*.js'
    ]);
    config.set(conf);
};
