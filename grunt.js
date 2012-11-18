/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '2.0.0alpha1',
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
        src: ['<banner:meta.banner>', 'src/terraformer-arcgis.js'],
        dest: 'dist/terraformer-arcgis.min.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', 'src/terraformer-arcgis.js'],
        dest: 'dist/terraformer-arcgis.min.js'
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
        console: true,
        XDomainRequest: true,
        jQuery: true,
        dojo: true,
        require: true,
        define: true,
        esri: true,
        Enum: true
      }
    },
    uglify: {},
    jasmine: {
      all: {
        src:['spec/SpecRunner.html'],
        errorReporting: true,
        timeout: 20000
      }
    }
  });

  // Default task.
  //grunt.registerTask('default', 'lint jasmine concat min');
  grunt.registerTask('default', 'lint concat min');

  grunt.loadNpmTasks('grunt-jasmine-task');

};
