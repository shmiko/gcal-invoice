module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-karma');
    grunt.initConfig({
        karma: {
            unit: {
                configFile: './tests/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            }
        }
    });
    grunt.registerTask('test', ['karma:unit']);
};
