module.exports = function(grunt) {

    // ------------------
    // CONFIGURE GRUNT

    grunt.initConfig({

        // jshint: check all js files for errors
        jshint: {
            all: ['public/js/**/*.js']
        },

        // todo: uglify

        // todo: cssmin

        // watch: watch css and js files and process the above tasks
        watch: {
            css: {
                files: ['public/css/**/*.css'],
                tasks: []
            },

            js: {
                files: ['public/js/**/*.js'],
                tasks: ['jshint']
            }
        },

        // watch our node server for changes
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },

        // run watch and nodemon at the same time
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });

    // ------------------
    // LOAD GRUNT PLUGINS

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');


    // ------------------
    // CREATE TASKS

    // register the nodemon task when we runt grunt
    grunt.registerTask('default', ['jshint', 'concurrent']);
};