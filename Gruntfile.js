'use strict';

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    package: require('./package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: ['<%= jshint.lib.src %>'],
        tasks: ['jshint:lib', 'test']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'test']
      }
    },
    docker: {
      options: {
        lineNums: true,
        exclude: ['node_modules'],
        extras: ['fileSearch', 'goToLine']
      },
      app: {
        src: ['<%= jshint.gruntfile.src %>', '<%= jshint.lib.src %>', '<%= jshint.test.src %>'],
        dest: 'doc/'
      }
    },
    open: {
      doc: {
        path: 'doc/<%= package.main %>.html'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: process.env.TEST_REPORTER || 'dot'
        },
        src: ['test/**/*.spec.js']
      }
    }
  });

  // Lint code and run unit tests
  grunt.registerTask('default', ['jshint', 'test']);
  // Run unit tests without linting
  grunt.registerTask('test', ['mochaTest']);
  // Watch for changes without running the server
  grunt.registerTask('monitor', ['default', 'watch']);
  // Generate and open documentation. use `grunt open:doc` to just open previously generated docs
  grunt.registerTask('doc', ['docker:app', 'open:doc']);
};
