module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'lib/leaflet-0.7.3/leaflet-src.js',
                    'lib/*.js',
                    'src/constants.js',
                    'src/utils.js',
                    'src/auth.js',
                    'src/map.js',
                    'src/marker.js',
                    'src/feature-layer.js',
                    'src/amigocloud.js'
                ],
                dest: 'amigocloud.js'
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
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default tasks
    grunt.registerTask('default', ['concat', 'uglify']);
};
