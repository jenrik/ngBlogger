var path = require('path');

module.exports = function(grunt) {
	grunt.registerTask('siteindex', 'Generate the list of pages for ngBlogger', function() {
		var pageFiles = grunt.file.expand({cwd:'assets/'}, '**/*.page.json');
		var index = {};

		for (var i = 0; i < pageFiles.length; i++) {
			var page = grunt.file.readJSON(path.join('assets/', pageFiles[i]));

			if (!page.template)
				grunt.fail.fatal(pageFiles[i] + ' is missing a template');

			var base = path.parse(pageFiles[i]).base;
			var name = base.substring(0, base.length - ".page.json".length);
			index[name] = {
				options: pageFiles[i],
				template: page.template
			}
		};

		//if (!index['/'])
		//	grunt.log.write('Warning: Their is no frontpage!');

		grunt.file.write('build/index.json', JSON.stringify(index) + ';');
	});
}