module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-karma');
    grunt.initConfig({
        karma: {
            unit: {
                configFile: './tests/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            }
        },
        less: {
            development: {
                options: {
                    paths: ['stylesheets/']
                },
                files: {
                    'public/stylesheets/main.css': 'stylesheets/main.less'
                }
            }
        }
    });
    grunt.registerTask('test', ['karma:unit']);
    grunt.loadNpmTasks('grunt-contrib-less');
};
