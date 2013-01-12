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
      files: ['grunt.js', 'src/*.js']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/terraformer.min.js'
      },
      node: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/node/terraformer.js'
      },
      version: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'versions/terraformer-<%= meta.version %>.min.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/terraformer.min.js'
      },
      version: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'versions/terraformer-<%= meta.version %>.min.js'
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
      spec: ["./spec/spec/GeoJSON.js", "./spec/spec/TerraformerSpec.js", "./spec/spec/ArcGISSpec.js"],
      projectRoot: ".",
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

  grunt.registerTask('default', 'lint build-wkt build-arcgis build-rtree jasmine jasmine_node');
  grunt.registerTask('build', 'default concat:dist min:dist concat:version min:version');

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

    var wrapper = fs.readFileSync('./src/Parsers/WKT/partials/module-source.js', 'utf8');

    var Parser = jison.Parser;
    var parser = new Parser(grammar);

    // generate source, ready to be written to disk
    var parserSource = parser.generate({ moduleType: "js" });

    wrapper = wrapper.replace('"SOURCE";', parserSource);

    fs.writeFileSync("./src/Parsers/WKT/wkt.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/Parsers/WKT/parser.js", wrapper, "utf8");

    return 'Files created.';
  });

  grunt.registerHelper('arcgis-parser', function() {
    var src = fs.readFileSync('./src/Parsers/ArcGIS/arcgis.js', 'utf8');

    var wrapper = fs.readFileSync('./src/Parsers/ArcGIS/partials/module-source.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/arcgis.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/Parsers/ArcGIS/index.js", wrapper, "utf8");

    return 'Files created.';
  });

  grunt.registerHelper('rtree-exports', function() {
    var src = fs.readFileSync('./src/rtree.js', 'utf8');

    var wrapper = fs.readFileSync('./src/partials/module-rtree.js', 'utf8');

    wrapper = wrapper.replace('"SOURCE";', src);

    fs.writeFileSync("./dist/rtree.js", wrapper, "utf8");
    fs.writeFileSync("./dist/node/RTree/index.js", wrapper, "utf8");

    return 'Files created.';
  });

  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-jasmine-node');

};