angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html'
		})

		// sample page 1
		.when('/sample1', {
			templateUrl: 'views/sample1.html'
		})

		// sample page 2 (with parameters)
		.when('/sample2:nerd_id', {
			templateUrl: 'views/sample2.html'
		});

	$locationProvider.html5Mode(true);

}]);