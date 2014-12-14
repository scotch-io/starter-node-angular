angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home',
			controller: 'MainController'
		})

		.when('/nerds', {
			templateUrl: 'views/nerd',
			controller: 'NerdController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek',
			controller: 'GeekController'	
		});

	$locationProvider.html5Mode(true);

}]);