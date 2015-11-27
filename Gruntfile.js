"use strict";

module.exports = function( grunt ) {

  grunt.initConfig( {
    jshint: {
      options: {
        jshintrc: true
      },
      app: {
        files: {
          src: [ "Gruntfile.js", "jquery.contenttoggle.js", "examples/*/*.js" ]
        }
      }
    },
    jscs: {
      options: {
        config: ".jscsrc",
        fix: true
      },
      app: {
        files: {
          src: [ "Gruntfile.js", "jquery.contenttoggle.js", "examples/*/*.js" ]
        }
      }
    },
    uglify: {
      app: {
        files: { "jquery.contenttoggle.min.js": "jquery.contenttoggle.js" }
      }
    }
  } );

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-jscs" );

  grunt.registerTask( "default", [ "jshint", "jscs" ] );

};
