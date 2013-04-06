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
      versioned_browser: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/browser/versions/<%= meta.version %>/terraformer-<%= meta.version %>.min.js'
      },
      node: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/node/terraformer.js'
      },
      terraformer_versioned: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/terraformer-<%= meta.version %>.js'
      },
      rtree_versioned: {
        src: ["dist/browser/rtree.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/rtree-<%= meta.version %>.js'
      },
      arcgis_versioned: {
        src: ["dist/browser/arcgis.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/arcgis-<%= meta.version %>.js'
      },
      wkt_versioned: {
        src: ["dist/browser/wkt.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/wkt-<%= meta.version %>.js'
      }
    },
    min: {
      terraformer: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/browser/terraformer.min.js'
      },
      terraformer_versioned: {
        src: ["dist/browser/terraformer.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/terraformer-<%= meta.version %>.min.js'
      },
      rtree: {
        src: ["dist/browser/rtree.js"],
        dest: 'dist/browser/rtree.min.js'
      },
      rtree_versioned: {
        src: ["dist/browser/rtree.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/rtree-<%= meta.version %>.min.js'
      },
      arcgis: {
        src: ["dist/browser/arcgis.js"],
        dest: 'dist/browser/arcgis.min.js'
      },
      arcgis_versioned: {
        src: ["dist/browser/arcgis.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/arcgis-<%= meta.version %>.min.js'
      },
      wkt: {
        src: ["dist/browser/wkt.js"],
        dest: 'dist/browser/wkt.min.js'
      },
      wkt_versioned: {
        src: ["dist/browser/wkt.js"],
        dest: 'dist/browser/versions/<%= meta.version %>/wkt-<%= meta.version %>.min.js'
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
        timeout: 2000
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
  grunt.registerTask('build-source', 'build-terraformer build-wkt build-arcgis build-rtree');
  grunt.registerTask('build-versioned', 'default concat-versioned minify-versioned');

  // minify all the browser files and version
  grunt.registerTask('minify', 'min:terraformer min:rtree min:arcgis min:wkt');
  grunt.registerTask('minify-versioned', 'min:terraformer_versioned min:rtree_versioned min:arcgis_versioned min:wkt_versioned');
  grunt.registerTask('concat-versioned', 'concat:terraformer_versioned concat:rtree_versioned concat:arcgis_versioned concat:wkt_versioned');

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