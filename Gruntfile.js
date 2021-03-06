module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ''
            },
            js: {
                src: [
                    'lib/leaflet-0.7.3/leaflet-src.js',
                    'lib/*.js',
                    'src/constants.js',
                    'src/auth.js',
                    'src/utils.js',
                    'src/map.js',
                    'src/marker.js',
                    'src/feature-layer.js',
                    'src/realtime.js',
                    'src/events.js',
                    'src/amigocloud.js'
                ],
                dest: 'amigocloud.js'
            },
            css: {
                src: [
                    'lib/leaflet-0.7.3/*.css',
                    'src/css/*.css'
                ],
                dest: 'amigocloud.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! Generated on <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true,
                mangle: false
            },
            build: {
                files: {
                    'amigocloud.min.js': ['amigocloud.js']
                }
            }
        },
        cssmin: {
            css:{
                src: 'amigocloud.css',
                dest: 'amigocloud.min.css'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');

    // Default tasks
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};
