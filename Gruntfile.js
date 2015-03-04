module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-template-html');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.task.loadTasks('grunt_tasks');

	var bloggerJSON = grunt.file.readJSON('blogger.json');

	grunt.initConfig({
		watch: {
			js: {
				files: ['js/**/*.js'],
				tasks: ['uglify']
			},
			sass: {
				files: ['sass/**'],
				tasks: ['sass']
			},
			html: {
				files: ['index.html'],
				tasks: ['template']
			},
			assets: {
				files: ['assets/**'],
				tasks: ['copy:assets', 'siteindex'] // ToDo seperate siteindex into it's own watch task
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			dev: {
				tasks: ['watch:js', 'watch:sass', 'watch:html', 'watch:assets']
			}
		},

		sass: {
			build: {
				options: {
					style: 'compressed',
					loadPath: 'sass/'
				},
				files: {
					'build/ng-blogger.min.css': 'sass/ng-blogger.scss'
				}
			}
		},

		uglify: {
			options: {
				compress: false,
				sourceMap: true
			},
			build: {
				files: {
					'build/ng-blogger.min.js': 'js/**/*.js'
				}
			}
		},

		copy: {
			deps: {
				files: [
					{
						src: [
							'bower_components/angular/angular.js',
							'bower_components/angular/angular.min.js',
							'bower_components/angular/angular.min.js.map',
							'bower_components/angular-animate/angular-animate.js',
							'bower_components/angular-animate/angular-animate.min.js',
							'bower_components/angular-animate/angular-animate.min.js.map',
							'bower_components/angular-route/angular-route.min.js',
							'bower_components/angular-route/angular-route.min.js.map',
							'bower_components/markdown-it/dist/markdown-it.min.js'
						],
						dest: 'build/'
					}
				]
			},
			assets: {
				files: [
					{
						expand: true,
						src: '**',
						dest: 'build/',
						cwd: 'assets/'
					}
				]
			}
		},

		'http-server': {
			dev: {
				root: 'build/',
				port: 4000,
				host: '0.0.0.0',
				runInBackground: true
			}
		},

		template: {
			build: {
				engine: 'handlebars',
				partials: [],
				data: 'blogger.json',
				options: {},
				files: [
					{
						src: 'index.html',
						dest: 'build/index.html'
					}
				]
			}
		},

		clean: {
			build: 'build/*'
		},

		jshint: {
			main: ['js/**/*.js']
		}
	});

	grunt.registerTask('test', ['jshint', 'sass:test']);
	grunt.registerTask('build', ['clean', 'jshint', 'uglify', 'sass', 'template', 'copy:deps', 'copy:assets', 'siteindex']);
	grunt.registerTask('dev', ['clean', 'copy:deps', 'copy:assets', 'uglify', 'sass', 'template', 'http-server', 'concurrent:dev']);
	grunt.registerTask('default', ['dev']);
}
