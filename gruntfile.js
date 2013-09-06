
module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    meta: {
      version: '0.0.1',
      banner: '/*! Terraformer JS - <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/geoloqi/Terraformer\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Licensed MIT */'
    },

    jshint: {
      files: [ 'gruntfile.js', 'src/*.js' ],
      options: {
        node: true
      }
    },

    concat: {
      browser: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/browser/terraformer.js'
      },
      node: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/node/terraformer.js'
      },
    },

    uglify: {
      options: {
        report: 'gzip'
      },
      terraformer: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/minified/terraformer.min.js'
      }
    },

    jasmine: {
      coverage: {
        src: [
          "dist/browser/terraformer.js"
        ],
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helpers.js',
          //keepRunner: true,
          outfile: 'SpecRunner.html',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: './.coverage/coverage.json',
            report: './.coverage',
            thresholds: {
              lines: 75,
              statements: 75,
              branches: 75,
              functions: 75
            }
          }
        }
      }
    },

    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'Spec',
        helperNameMatcher: 'Helpers'
      },
      all: ['spec/']
    },

    complexity: {
      generic: {
        src: [ 'dist/browser/terraformer.js' ],
        options: {
          jsLintXML: 'complexity.xml', // create XML JSLint-like report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 6,
          halstead: 15,
          maintainability: 65
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', ['concat', 'jasmine_node', 'jasmine']);
  grunt.registerTask('default', [ 'concat', 'jshint', 'jasmine', 'jasmine_node', 'uglify', 'complexity' ]);
};
