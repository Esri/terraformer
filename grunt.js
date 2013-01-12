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
      tasks: 'lint jasmine jasmine_node'
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
      spec: ["./spec/spec/GeoJSON.js", "./spec/spec/SpecHelpers.js", "./spec/spec/TerraformerSpec.js", "./spec/spec/ArcGISSpec.js"],
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

  grunt.registerTask('default', 'lint jasmine_node jasmine concat min concat:version min:version build-wkt');
  grunt.registerTask('version', 'lint jasmine_node jasmine concat:version min:version');
  grunt.registerTask('node', 'lint build-wkt concat:node');
  grunt.registerTask('browser', 'lint jasmine');

  grunt.registerTask('build-wkt', 'Building WKT Parser', function() {
    var results = grunt.helper('wkt-parser');
    grunt.log.write(results);
  });

  // Register a helper.
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

    return 'done';
  });
  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-jasmine-node');

};