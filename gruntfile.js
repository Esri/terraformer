var fs = require('fs');

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [ 'gruntfile.js', 'terraformer.js' ],
      options: {
        node: true
      }
    },

    uglify: {
      options: {
        report: 'gzip',
        banner: '/*! Terraformer JS - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/esri/Terraformer\n' +
        '*   Copyright (c) 2013-<%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Licensed MIT */'
      },
      terraformer: {
        src: ['terraformer.js'],
        dest: 'terraformer.min.js'
      },
      versioned: {
        src: ['terraformer.js'],
        dest: 'terraformer-<%= pkg.version %>.min.js'
      }
    },

    jasmine: {
      coverage: {
        src: [
          "terraformer.js"
        ],
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helpers.js',
          // not sure why coverage isnt being generated
          // keepRunner: true, 
          // outfile: 'SpecRunner.html',
          // template: require('grunt-template-jasmine-istanbul'),
          // templateOptions: {
          //   coverage: './.coverage/coverage.json',
          //   report: './.coverage',
          //   thresholds: {
          //     lines: 90,
          //     statements: 90,
          //     branches: 90,
          //     functions: 90
          //   }
          // }
        }
      }
    },

    complexity: {
      generic: {
        src: [ 'terraformer.js' ],
        options: {
          jsLintXML: 'complexity.xml', // create XML JSLint-like report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 6,
          halstead: 15,
          maintainability: 65
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'docs-build',
        repo: 'git@github.com:Esri/Terraformer.git',
        branch: 'gh-pages'
      },
      src: ['**']
    },

    middleman: {
      server: {
        options: {
          useBundle: true
        }
      },
      build: {
        options: {
          useBundle: true,
          server: false,
          command: "build"
        }
      }
    },

    copy: {
      main: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, src: ['examples/browser/**'], dest: 'docs-build/'}
        ],
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-middleman');
  
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('version', ['test', 'uglify']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('docs-build', ['middleman:build', 'copy']);
  grunt.registerTask('deploy-docs', ['middleman:build', 'copy', 'gh-pages']);
};
