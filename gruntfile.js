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
      geostore: {
        src: ['<banner:meta.banner>', "src/geostore.js"],
        dest: 'dist/browser/geostore.js'
      },
      geostore_node: {
        src: ['src/geostore.js'],
        dest: 'dist/node/GeoStore/index.js'
      },
      memory_store: {
        src: ['<banner:meta.banner>', "src/Store/Memory.js"],
        dest: 'dist/browser/Store/Memory.js'
      },
      local_store: {
        src: ['<banner:meta.banner>', "src/Store/LocalStorage.js"],
        dest: 'dist/browser/Store/LocalStorage.js'
      }
    },

    uglify: {
      terraformer: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/minified/terraformer.min.js'
      },
      rtree: {
        src: ["dist/browser/rtree.js"],
        dest: 'dist/minified/rtree.min.js'
      },
      arcgis: {
        src: ["dist/browser/arcgis.js"],
        dest: 'dist/minified/arcgis.min.js'
      },
      wkt: {
        src: ["dist/browser/wkt.js"],
        dest: 'dist/minified/wkt.min.js'
      },
      geostore: {
        src: ["dist/browser/geostore.js"],
        dest: 'dist/minified/geostore.min.js'
      },
      memory_store: {
        src: ["dist/browser/Store/Memory.js"],
        dest: 'dist/minified/Store/Memory.min.js'
      },
      local_store: {
        src: ["dist/browser/Store/LocalStorage.js"],
        dest: 'dist/minified/Store/LocalStorage.min.js'
      }
    },

    jasmine: {
      coverage: {
        src: [
          "dist/browser/terraformer.js",
          "dist/browser/arcgis.js",
          "dist/browser/wkt.js",
          "dist/browser/rtree.js",
          "dist/browser/geostore.js",
          "dist/browser/Store/Memory.js",
          "dist/browser/Store/LocalStorage.js"
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
              lines: 70,
              statements: 70,
              branches: 50,
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

    complexity: {
      generic: {
        src: [ 'dist/browser/arcgis.js', 'dist/browser/geostore.js', 'dist/browser/rtree.js', 'dist/browser/terraformer.js', 'dist/browser/Store/Memory.js', 'dist/browser/Store/LocalStorage.js' ],
        options: {
          jsLintXML: 'complexity.xml', // create XML JSLint-like report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 5,
          halstead: 15,
          maintainability: 65
        }
      }
    }
  });

  grunt.registerTask('wkt-parser', 'Building WKT Parser', function() {
    var grammar = fs.readFileSync('./src/Parsers/WKT/partials/wkt.yy', 'utf8');
    var convert = fs.readFileSync('./src/Parsers/WKT/partials/convert.js', 'utf8');

    var wrapper = fs.readFileSync('./src/Parsers/WKT/partials/module-source.js', 'utf8');

    var Parser = jison.Parser;
    var parser = new Parser(grammar);

    // generate source, ready to be written to disk
    var parserSource = parser.generate({ moduleType: "js" });

    wrapper = wrapper.replace('"SOURCE";', parserSource + convert);

    fs.writeFileSync("./src/Parsers/WKT/wkt.js", wrapper, "utf8");
    fs.writeFileSync("./dist/browser/wkt.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/Parsers/WKT/parser.js", wrapper, "utf8");

    grunt.log.write('Files created.\n');
  });

  grunt.registerTask('arcgis-parser', 'Building ArcGIS Parser', function() {
    var src = fs.readFileSync('./src/Parsers/ArcGIS/arcgis.js', 'utf8');

    var wrapper = fs.readFileSync('./src/Parsers/ArcGIS/partials/module-source.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/browser/arcgis.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/Parsers/ArcGIS/index.js", wrapper, "utf8");

    grunt.log.write('Files created.\n');
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
  grunt.registerTask('build_source', ['wkt-parser', 'arcgis-parser', 'rtree-exports']);
  grunt.registerTask('default', [ 'build_source', 'concat', 'jshint', 'jasmine', 'jasmine_node', 'uglify', 'complexity' ]);
};