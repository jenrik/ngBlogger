var ngblogger = angular.module('ngBlogger', ['ngBlogger.markdown', 'ngRoute']);

/**
 * Create page routes.
 * /page/:name opens a page.
 * / is the frontpage and should list a pages.
 * If no route matches display 404 page.
 */
ngblogger.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/page/:name', {
		template: '<div ng-include src="options.template"></div>',
		controller: 'pageController'
	});

	$routeProvider.when('/', {
		templateUrl: 'templates/frontpage.html',
	});

	$routeProvider.otherwise({
		templateUrl: 'templates/404.html'
	});
}]);

/**
 * Provides the global options object on the root scope.
 */
ngblogger.controller('pageController', ['$rootScope', '$routeParams', '$http', '$location', function($rootScope, $routeParams, $http, $location) {
	var req = $http.get('pages/' + $routeParams.name + '.page.json');

	req.success(function(data) {
		$rootScope.options = data;
	});

	req.error(function() {
		// Failed to load page options
		console.error('Failed to load page: Couln\'t load page options');
	});
}]);

ngblogger.factory('pageList', ['$http', '$q', function($http, $q) {
	var index = null;

	return $q(function(resolve, reject) {
		if (index !== null) {
			resolve(index);
			return;
		}

		// ToDo: Load page list
		//$http.get("index.json")
	});
}]);
