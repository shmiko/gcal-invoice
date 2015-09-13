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
        },
        jshint: {
            all: ['public/javascripts', 'tests/unit']
        },
        jscs: {
            all: ['public/javascripts/**.js', 'tests/unit/**.js']
        }
    });
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
};
