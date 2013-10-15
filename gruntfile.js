module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/* <%= pkg.name %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n * Author: Kurtis Kemple\n * Email: kurtiskemple@gmail.com\n * URL: http://kurtiskemple.com\n */\n'
      },
      build: {
        src : [ 'src/core.js', 'src/app.js', 'src/sandbox.js', 'src/form.js'],
        dest : 'dist/mod.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};