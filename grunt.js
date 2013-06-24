var fs = require('fs'),
    jison = require('jison');

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.0.1',
      banner: '/*! Terraformer JS - <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/geoloqi/Terraformer\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'src/*.js', 'src/Parsers/ArcGIS/*.js']
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

    min: {
      terraformer: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/browser/terraformer.min.js'
      },
      rtree: {
        src: ["dist/browser/rtree.js"],
        dest: 'dist/browser/rtree.min.js'
      },
      arcgis: {
        src: ["dist/browser/arcgis.js"],
        dest: 'dist/browser/arcgis.min.js'
      },
      wkt: {
        src: ["dist/browser/wkt.js"],
        dest: 'dist/browser/wkt.min.js'
      },
      geostore: {
        src: ["dist/browser/geostore.js"],
        dest: 'dist/browser/geostore.min.js'
      },
      memory_store: {
        src: ["dist/browser/Store/Memory.js"],
        dest: 'dist/browser/Store/Memory.js'
      },
      local_store: {
        src: ["dist/browser/Store/LocalStorage.js"],
        dest: 'dist/browser/Store/LocalStorage.js'
      }
    },

    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef:  true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        module: true,
        define: true,
        require: true,
        exports: true,
        Terraformer: true,
        console: true,
        parser: true
      }
    },
    uglify: {},
    jasmine: {
      all: {
        src:['spec/SpecRunner.html'],
        errorReporting: true,
        timeout: 2000,
        keepRunner: true
      }
    },
    jasmine_node: {
      specNameMatcher: "-spec",
      specFolders: ["./spec/specs"],
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  });

  // By default build everything and run the tests
  grunt.registerTask('default', 'lint build-source jasmine_node jasmine');

  // builds
  grunt.registerTask('build', 'default minify');
  grunt.registerTask('build-source', 'build-terraformer build-wkt build-arcgis build-rtree build-geostore');

  // minify all the browser files
  grunt.registerTask('minify', 'min:terraformer min:rtree min:arcgis min:wkt min:geostore min:memory_store min:local_store');

  // lint, build and run environment specific tests
  grunt.registerTask('node', 'lint build-source jasmine_node');
  grunt.registerTask('browser', 'lint build-source jasmine');

  // build terraform by moving files to /dist
  grunt.registerTask('build-terraformer', 'concat:browser concat:node');

  grunt.registerTask('build-wkt', 'Building WKT Parser', function() {
    grunt.log.write(grunt.helper('wkt-parser'));
  });

  grunt.registerTask('build-arcgis', 'Building ArcGIS Parser', function() {
    grunt.log.write(grunt.helper('arcgis-parser'));
  });

  grunt.registerTask('build-rtree', 'Building RTree node module', function () {
    grunt.log.write(grunt.helper('rtree-exports'));
  });

  grunt.registerTask('build-geostore', 'concat:geostore_node concat:geostore concat:memory_store concat:local_store');

  // Register helpers
  grunt.registerHelper('wkt-parser', function() {
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

    return 'Files created.\n';
  });

  grunt.registerHelper('arcgis-parser', function() {
    var src = fs.readFileSync('./src/Parsers/ArcGIS/arcgis.js', 'utf8');

    var wrapper = fs.readFileSync('./src/Parsers/ArcGIS/partials/module-source.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/browser/arcgis.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/Parsers/ArcGIS/index.js", wrapper, "utf8");

    return 'Files created.\n';
  });

  grunt.registerHelper('rtree-exports', function() {
    var src = fs.readFileSync('./src/rtree.js', 'utf8');

    var wrapper = fs.readFileSync('./src/partials/module-rtree.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/browser/rtree.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/RTree/index.js", wrapper, "utf8");

    return 'Files created.\n';
  });

  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-jasmine-node');

};