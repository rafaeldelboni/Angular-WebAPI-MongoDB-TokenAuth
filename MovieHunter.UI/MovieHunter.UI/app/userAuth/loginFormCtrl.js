(function () {
    "use strict";

    angular
        .module("movieHunter")
        .controller("loginFormCtrl",
                    ["$scope",
                     "$rootScope",
                     "AUTH_EVENTS",
                     "authResource",
                     loginFormCtrl]);

    function loginFormCtrl ($scope, $rootScope, AUTH_EVENTS, authResource) {

    	$scope.credentials = {
			username: '',
			password: ''
		};

		$scope.login = function (credentials) {
			authResource.login(credentials).then(
				function (user) {
					$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					$scope.setCurrentUser(user);
				}, function () {
					$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
				}
			);
		};
	}

}());