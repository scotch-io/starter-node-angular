angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html'
		})

		// sample page 1
		.when('/nerds', {
			templateUrl: 'views/nerd.html'
		})

		// sample page 2 (with parameters)
		.when('/test:name', {
			templateUrl: 'views/nerd.html'
		});

	$locationProvider.html5Mode(true);

}]);