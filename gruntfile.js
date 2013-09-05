  var fs = require('fs');
var jison = require('jison');

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
      files: [ 'grunt.js', 'src/*.js', 'src/Parsers/ArcGIS/*.js', 'src/Store/*.js' ],
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
      memory_store: {
        src: ['<banner:meta.banner>', "src/Store/Memory.js"],
        dest: 'dist/browser/Store/Memory.js'
      }
    },

    uglify: {
      options: {
        report: 'gzip'
      },
      terraformer: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/minified/terraformer.min.js'
      },
      rtree: {
        src: ["dist/browser/rtree.js"],
        dest: 'dist/minified/rtree.min.js'
      },
      memory_store: {
        src: ["dist/browser/Store/Memory.js"],
        dest: 'dist/minified/Store/Memory.min.js'
      }
    },

    jasmine: {
      coverage: {
        src: [
          "dist/browser/terraformer.js",
          "dist/browser/rtree.js"
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
        src: [ 'dist/browser/rtree.js', 'dist/browser/terraformer.js', 'dist/browser/Store/Memory.js' ],
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


  grunt.registerTask('rtree-exports', 'Building RTree node module', function() {
    var src = fs.readFileSync('./src/rtree.js', 'utf8');

    var wrapper = fs.readFileSync('./src/partials/module-rtree.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/browser/rtree.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/RTree/index.js", wrapper, "utf8");

    grunt.log.write('Files created.\n');
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', ['build_source', 'concat', 'jasmine_node', 'jasmine']);
  grunt.registerTask('build_source', ['rtree-exports']);
  grunt.registerTask('default', [ 'build_source', 'concat', 'jshint', 'jasmine', 'jasmine_node', 'uglify', 'complexity' ]);
};
