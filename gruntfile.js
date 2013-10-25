module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				'-W099': true,
				'-W014': true,
				'-W069': true
			},
			src: ['src/core.js', 'src/sanbox.js', 'src/template.js', 'src/form.js', 'src/app.js', 'src/widgets.js', 'spec/*.js']
		},
		uglify: {
			options: {
				banner: '/* <%= pkg.name %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n * Author: Kurtis Kemple\n * Email: kurtiskemple@gmail.com\n * URL: http://kurtiskemple.com\n */\n'
			},
			build: {
				src : [ 'src/core.js', 'src/app.js', 'src/sandbox.js', 'src/form.js', 'src/widgets.js' ],
				dest : 'dist/mod.<%= pkg.version %>.min.js'
			}
		},
		concat: {
			options: {
				banner: '/* <%= pkg.name %>\n * <%= grunt.template.today("yyyy-mm-dd") %>\n * Author: Kurtis Kemple\n * Email: kurtiskemple@gmail.com\n * URL: http://kurtiskemple.com\n */\n',
				separator: ';'
			},
			dist: {
				src : [ 'src/core.js', 'src/app.js', 'src/sandbox.js', 'src/form.js', 'src/widgets.js' ],
				dest : 'dist/mod.<%= pkg.version %>.js'
			}
		},
		jasmine: {
			src: ['src/base.js', 'src/core.js', 'src/sandbox.js', 'src/app.js', 'src/form.js', 'src/template.js'],
			options: {
				keepRunner: true,
				specs: 'spec/**/*Spec.js'
			}
		},
		yuidoc: {
			compile: grunt.file.readJSON( 'yuidoc.json' )
		},
		watch: {
			files: ['src/*.js', 'index.html', 'spec/*.js' ],
			tasks: [ 'default' ],
			options: {
				livereload: {
					port: 9000
				}
			}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', [ 'jshint', 'jasmine', 'uglify', 'concat', 'yuidoc' ]);
	grunt.registerTask('test', [ 'jshint', 'jasmine' ]);
	grunt.registerTask('build', [ 'uglify', 'concat', 'yuidoc' ]);

};