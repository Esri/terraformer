var fs = require('fs');
var jison = require('jison');

module.exports = function (grunt) {
  grunt.initConfig({
    aws: grunt.file.readJSON(process.env.HOME + '/terraformer-s3.json'),
    pkg:   grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*! Terraformer JS - <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
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
      },
      versioned: {
        src: ["terraformer-wkt-parser.js"],
        dest: 'versions/terraformer-wkt-parser-<%= pkg.version %>.min.js'
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
          "terraformer-wkt-parser.js"
        ],
        options: {
          specs: 'spec/*Spec.js',
          helpers: [
            "node_modules/terraformer/terraformer.js"
          ],
          //keepRunner: true,
          outfile: 'SpecRunner.html',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: './coverage/coverage.json',
            report: './coverage',
            // due to the generated aspects of the parser, thresholds are much lower
            thresholds: {
              lines: 70,
              statements: 70,
              branches: 70,
              functions: 70
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

    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // 1 Year cache policy (1000 * 60 * 60 * 24 * 365)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      dev: {
        upload: [
          {
            src: 'versions/terraformer-wkt-parser-<%= pkg.version %>.min.js',
            dest: 'terraformer-wkt-parser/<%= pkg.version %>/terraformer-wkt-parser.min.js'
          }
        ]
      },
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
  grunt.loadNpmTasks('grunt-s3');

  grunt.registerTask('test', [ 'wkt-parser', 'vows', 'jasmine', 'jasmine_node' ]);
  grunt.registerTask('default', [ 'test' ]);
  grunt.registerTask('version', [ 'test', 'uglify', 's3' ]);
};