(function () {
    "use strict";

    angular
        .module("movieHunter")
        .controller("loginFormCtrl",
                    ["$scope",
                     "$rootScope",
                     "$location",
                     "AUTH_EVENTS",
                     "authResource",
                     loginFormCtrl]);

    function loginFormCtrl ($scope, $rootScope, $location, AUTH_EVENTS, authResource) {

		$scope.loginMessage = "";

    	$scope.credentials = {
			username: '',
			password: ''
		};

		$scope.login = function (credentials) {

			authResource.login(credentials).then(
				function (user) {
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					$scope.setCurrentUser(user);
					$location.path('/');
				}, function () {
					$scope.loginMessage = "Login failed!";
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
				}

			);
		};

		$scope.init = function () {
			// TODO: Show logoff button when user is already logged
		};
	}

}());