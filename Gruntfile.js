'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      app: {
        files: {
          src: ['Gruntfile.js', 'jquery.contenttoggle.js']
        }
      }
    },
    uglify: {
      app: {
        files: {'jquery.contenttoggle.min.js': 'jquery.contenttoggle.js'},
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint']);

};
