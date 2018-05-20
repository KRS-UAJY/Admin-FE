
'use strict';
	// create the module and name it scotchApp
	angular.module('scotchApp', ['ngRoute', 'datatables', 'datatables.buttons', 'ngStorage' ,'ngMockE2E'])

	// configure our routes
	.config(function($routeProvider) {
	    $routeProvider
	    // route for the home page
	        .when('/home', {
	        templateUrl: 'pages/login.html',
			controller: 'LoginController',
			controllerAs: 'SebuahLogin'
	    })

		// route for the about page
		.when('/display-krs', {
			templateUrl: 'pages/display-krs.html',
			controller: 'TablesController',
	        controllerAs: 'tables'
		})
	    .when('/tables', {
	        templateUrl: 'pages/tables.html',
	        // controller: 'TablesController',
	        // controllerAs: 'tables'
		})
		.when('/jadwal-ujian', {
			templateUrl: 'pages/jadwal-ujian.html',
		})
		.when('/jadwal-kuliah', {
			templateUrl: 'pages/jadwal-kuliah.html',
		})
		.when('/admin', {
			templateUrl: 'pages/admin-login.html',
		})
		.when('/dashboard', {
			templateUrl: 'pages/display-krs.html',
			controller: 'TablesController',
	        controllerAs: 'tables'
		})
		.when('/penawaran', {
			templateUrl: 'pages/dashboard-setkrs.html',
			controller: 'TablesController',
	        controllerAs: 'tables'
		})
		.when('/test', {
			templateUrl: 'pages/test.html'
		})

	    // route for the contact page
	    // .when('/contact', {
	    // 	templateUrl : 'pages/contact.html',
	    // 	controller  : 'contactController'
	    // })
	    .otherwise({
	        redirectTo: '/home'
	    });
	})
	.run(function($rootScope, $http, $location, $localStorage) {
        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/home'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/home');
            }
		})
		
    })