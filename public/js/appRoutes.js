angular.module('appRoutes').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'NerdController'
		})

		// sample page 1
		.when('/sample1', {
			templateUrl: 'views/sample1.html',
			controller: 'NerdController'
		})

		// sample page 2 (with parameters)
		.when('/sample2:nerd_id', {
			templateUrl: 'views/sample2.html',
			controller: 'NerdController'
		});

		// enable html5 history api
		$locationProvider.html5mode(true);

}]);