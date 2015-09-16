// Application definition
// Configures the UI routes
(function () {
    // Define the main module
    var app = angular.module("movieHunter", ["ngRoute", "common.services"]);

    app.constant(
	        "AUTH_EVENTS", {
				loginSuccess: "auth-login-success",
				loginFailed: "auth-login-failed",
				logoutSuccess: "auth-logout-success",
				sessionTimeout: "auth-session-timeout",
				notAuthenticated: "auth-not-authenticated",
				notAuthorized: "auth-not-authorized"
			}
	);
    app.constant(
			"USER_ROLES", {
				all: "*",
				admin: "admin",
				guest: "guest"
			}
	);

    app.factory('AuthInterceptor', function ($window, $q) {
	    return {
	        request: function(config) {
	            config.headers = config.headers || {};
	            if ($window.sessionStorage.getItem('token')) {
	                config.headers.Authorization = 'Token ' + $window.sessionStorage.getItem('token');
	            }
	            return config || $q.when(config);
	        },
	        response: function(response) {
	            if (response.status === 401) {
	                // TODO: Redirect user to login page.
	            }
	            return response || $q.when(response);
	        }
	    };
	});

	// Register the previously created AuthInterceptor.
	app.config(function ($httpProvider) {
	    $httpProvider.interceptors.push('AuthInterceptor');
	});
  
    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when("/", {
                    templateUrl: "app/welcomeView.html"
                })

                .when("/searchByTitle", {
                    templateUrl: "app/movieSearch/searchByTitleView.html",
                    controller: "SearchByTitleCtrl"
                })
                .when("/showMovieDetail/:movieId", {
                    templateUrl: "app/movieDetail/movieDetailView.html",
                    controller: "MovieDetailCtrl"
                })
                .when("/saveMovie/:movieId?", {
                    templateUrl: "app/movieForm/movieFormView.html",
                    controller: "MovieFormCtrl"
                })

                .when("/searchByActor", {
                    templateUrl: "app/movieSearch/searchByActorView.html",
                    controller: "SearchByActorCtrl"
                })
                .when("/showActorDetail/:actorId", {
                    templateUrl: "app/movieDetail/actorDetailView.html",
                    controller: "ActorDetailCtrl"
                })
                .when("/saveActor/:actorId?", {
                    templateUrl: "app/movieForm/actorFormView.html",
                    controller: "ActorFormCtrl"
                })
                .when("/login", {
                    templateUrl: "app/userAuth/loginForm.html",
                    controller: "loginFormCtrl"
                })

                .otherwise({
                    redirectTo: "/"
                })
        }]);

}());