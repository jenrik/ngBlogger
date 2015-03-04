var md = angular.module('ngBlogger.markdown', []);

/**
 * Service for converting markdown to HTML. Exposes a instance of MarkdownIt
 * 
 * @example
 * md("markdown here")
 * // <p>markdown here</p>
 * @return MarkdownIt instance
 */
md.factory('markdown', [function(markdown) {
	return window.markdownit('commonmark');
}]);

/**
 * Renders and display markdown
 * 
 * @param md Markdown to render and display
 */
md.directive('markdown', ['markdown', function(markdown) {
	return {
		restrict: 'E',
		templateUrl: 'templates/markdown/markdown.tpl.html',
		scope: {
			'md': '=md'
		},
		controllerAs: 'md',
		controller: ['$scope', '$sce', function($scope, $sce) {
			$scope.$watch('md', function() {
				$scope.result = $sce.trustAsHtml(markdown.render($scope.md));
			});
		}]
	};
}]);

/**
 * Download and render markdown
 * 
 * @param url Url to download markdown from
 */
md.factory('markdownRemote', ['$cacheFactory', '$http', '$q', 'markdown', function($cacheFactory, $http, $q, markdown) {
	var cache = $cacheFactory('markdown');

	return function(url) {
		$q(function(resolve, reject) {
			if (cache.get(url)) {
				resolve(cache.get(url));
				return;
			}

			$http.get(url)
				.success(function(data) {
					var result = markdown.render(data);
					cache.put(url, result);
					resolve(result);
				})
				.error(function(data, status, header) {
					reject({
						data: data,
						status: status,
						header: header
					});
				});
		});
	};
}]);

/**
 * Download, render and display markdown
 * 
 * @param md Markdown to render and display
 */
md.directive('markdownRemote', ['markdownRemote', function(markdownRemote) {
	return {
		restrict: 'E',
		templateUrl: 'templates/markdown/markdown-remote.tpl.html',
		scope: {
			'src': '=url'
		},
		controllerAs: 'md',
		controller: function($scope) {
			$scope.$watch('url', function() {
				markdownRemote($scope.url)
				.then(function(result) {
					$scope.result = result;
				}, function () {
					$scope.result = 'Error acquired while loading content';
				});
			});
		}
	};
}]);
