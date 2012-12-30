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
      files: ['grunt.js', 'src/**/*.js']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/terraformer.min.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'dist/terraformer.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint jasmine'
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
        exports: true
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
      spec: "./spec/spec/TerraformerSpec.js",
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

  // Default task.
  grunt.registerTask('default', 'lint jasmine_node jasmine concat min');
  grunt.registerTask('node', 'lint jasmine_node');
  grunt.registerTask('browser', 'lint jasmine');

  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-jasmine-node');

};
