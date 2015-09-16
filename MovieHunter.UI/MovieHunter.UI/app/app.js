// Application definition
// Configures the UI routes
(function () {
    // Define the main module
    var app = angular.module("movieHunter", ["ngRoute", "common.services"]);

    // Global constants
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
			all: '*',
			admin: 'admin',
			editor: 'editor',
			guest: 'guest'
		}
	);

	// Send token if any stored in session
    app.factory('AuthInterceptor', function (sessionService, $q) {
	    return {
	        request: function(config) {
	            config.headers = config.headers || {};
	            if (sessionService.id != null) {
	                config.headers.Authorization = 'Token ' + sessionService.id;
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

	// Defining routes
    app.config(["$routeProvider", "USER_ROLES",
        function ($routeProvider, USER_ROLES) {
            $routeProvider
                .when("/", {
                    templateUrl: "app/welcomeView.html",
					data: {
						authorizedRoles: [USER_ROLES.all]
					}
                })

                .when("/searchByTitle", {
                    templateUrl: "app/movieSearch/searchByTitleView.html",
                    controller: "SearchByTitleCtrl",
					data: {
						authorizedRoles: [USER_ROLES.all]
					}
                })
                .when("/showMovieDetail/:movieId", {
                    templateUrl: "app/movieDetail/movieDetailView.html",
                    controller: "MovieDetailCtrl",
					data: {
						authorizedRoles: [USER_ROLES.all]
					}
                })
                .when("/saveMovie/:movieId?", {
                    templateUrl: "app/movieForm/movieFormView.html",
                    controller: "MovieFormCtrl",
					data: {
						authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
					}
                })

                .when("/searchByActor", {
                    templateUrl: "app/movieSearch/searchByActorView.html",
                    controller: "SearchByActorCtrl",
					data: {
						authorizedRoles: [USER_ROLES.all]
					}
                })
                .when("/showActorDetail/:actorId", {
                    templateUrl: "app/movieDetail/actorDetailView.html",
                    controller: "ActorDetailCtrl",
					data: {
						authorizedRoles: [USER_ROLES.all]
					}
                })
                .when("/saveActor/:actorId?", {
                    templateUrl: "app/movieForm/actorFormView.html",
                    controller: "ActorFormCtrl",
					data: {
						authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
					}
                })
                .when("/login", {
                    templateUrl: "app/userAuth/loginForm.html",
                    controller: "loginFormCtrl",
					data: {
						authorizedRoles: [USER_ROLES.all]
					}
                })

                .otherwise({
                    redirectTo: "/"
                })
        }]);

        // Check authorizedRoles every time the route changes
        app.run(function ($rootScope, AUTH_EVENTS, authResource) {
			$rootScope.$on('$routeChangeStart', function (event, next) {

				var authorizedRoles = 
					((next.data != null) ? next.data.authorizedRoles : null);

				if (!authResource.isAuthorized(authorizedRoles)) {
				  event.preventDefault();
				  if (authResource.isAuthenticated()) {
				    // user is not allowed
				    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
				  } else {
				    // user is not logged in
				    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
				  }
				}
			});
		})

		// Fix problem with autofill is that most browsers don’t trigger an event on the input field.
		app.directive('formAutofillFix', function ($timeout) {
			return function (scope, element, attrs) {
				element.prop('method', 'post');
				if (attrs.ngSubmit) {
					$timeout(function () {
						element
						.unbind('submit')
						.bind('submit', function (event) {
							event.preventDefault();
							element
							.find('input, textarea, select')
							.triggerHandler('input')
							.triggerHandler('change')
							.triggerHandler('keydown');
							scope.$apply(attrs.ngSubmit);
						});
					});
				}
			};
		});
}());