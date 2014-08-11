/*
 * Clipper grunt file
 */


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Grunt export

module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-npm-install');

    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: ['./test/common.js']
                },
                src: ['test/*.js']
            }
        }
    });

    grunt.registerTask('default', ['npm-install', 'mochaTest']);
};