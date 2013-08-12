var fs = require('fs');
var jison = require('jison');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    meta: {
      version: '0.0.1',
      banner: '/*! Terraformer JS - <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/esri/terraformer-wkt-parser\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Esri, Inc.\n' +
        '*   Licensed MIT */'
    },

    uglify: {
      options: {
        report: 'gzip'
      },
      wkt: {
        src: ["terraformer-wkt-parser.js"],
        dest: 'terraformer-wkt-parser.min.js'
      }
    },

    vows: {
      all: {
        options: {
          reporter: "spec",
          verbose: true,
          silent: false,
          colors: true
        },
        src: [ "test/*.js" ]
      }
    },

    jasmine: {
      coverage: {
        src: [
          "node_modules/terraformer/terraformer.js",
          "terraformer-wkt-parser.js"
        ],
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helpers.js',
          //keepRunner: true,
          outfile: 'SpecRunner.html',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: './coverage/coverage.json',
            report: './coverage',
            // due to the generated aspects of the parser, thresholds are much lower
            thresholds: {
              lines: 50,
              statements: 50,
              branches: 50,
              functions: 50
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
    }
  });

  grunt.registerTask('wkt-parser', 'Building WKT Parser', function() {
    var grammar = fs.readFileSync('./src/wkt.yy', 'utf8');

    var wrapper = fs.readFileSync('./src/module-source.js', 'utf8');

    var Parser = jison.Parser;
    var parser = new Parser(grammar);

    // generate source, ready to be written to disk
    var parserSource = parser.generate({ moduleType: "js" });

    wrapper = wrapper.replace('"SOURCE";', parserSource);

    fs.writeFileSync("./terraformer-wkt-parser.js", wrapper, "utf8");

    grunt.log.write('Files created.\n');
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-vows");
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('test', [ 'wkt-parser', 'vows', 'jasmine', 'jasmine_node' ]);
  grunt.registerTask('default', [ 'wkt-parser', 'vows', 'jasmine', 'jasmine_node', 'uglify' ]);
};