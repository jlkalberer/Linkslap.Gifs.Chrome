module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      development: {
        options: {
          paths: ["node_modules", "source/content"]
        },
        files: {
          "source/content/main.css": "source/content/less/main.less"
        }
      }
    },
    copy: {
      main: {
        expand: true, 
        flatten: true, 
        src: [
          'node_modules/angular/*.js',
          'node_modules/angular/*.js.*',
          'node_modules/jquery/dist/*',
        ], 
        dest: 'source/js/vendor', 
        filter: 'isFile'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      css: {
        files: ['source/content/**/*.less'],
        tasks: ['less:development']
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('setup', ['copy:main'])
  grunt.registerTask('default', ['copy:main', 'watch:css']);
};