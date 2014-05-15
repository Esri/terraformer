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
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Licensed MIT */'
      },
      terraformer: {
        src: ['terraformer.js'],
        dest: 'terraformer.min.js'
      },
      versioned: {
        src: ['terraformer.js'],
        dest: 'versions/terraformer-<%= pkg.version %>.min.js'
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
          //keepRunner: true,
          outfile: 'SpecRunner.html',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: './.coverage/coverage.json',
            report: './.coverage',
            thresholds: {
              lines: 90,
              statements: 90,
              branches: 90,
              functions: 90
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
            src: 'versions/terraformer-<%= pkg.version %>.min.js',
            dest: 'terraformer/<%= pkg.version %>/terraformer.min.js'
          }
        ]
      },
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
    }

  });

  var awsExists = fs.existsSync(process.env.HOME + '/terraformer-s3.json');

  if (awsExists) {
    grunt.config.set('aws', grunt.file.readJSON(process.env.HOME + '/terraformer-s3.json'));
  }

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-middleman');

  grunt.registerTask('test', ['jshint', 'jasmine_node', 'jasmine']);
  grunt.registerTask('version', ['test', 'uglify', 's3']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('deploy-docs', ['middleman:build', 'gh-pages']);
};
