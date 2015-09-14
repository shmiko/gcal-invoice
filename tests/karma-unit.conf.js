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
    conf.reporters.push('coverage');
    conf.coverageReporter = {
        dir: 'coverage',
        reporters: [
            {type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt'}
        ]
    };
    conf.preprocessors = {
        'public/javascripts/**/*.js': ['coverage']
    };
    config.set(conf);
};
