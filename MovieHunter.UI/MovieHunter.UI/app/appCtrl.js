(function () {
    "use strict";

    angular
        .module("movieHunter")
        .controller("appCtrl",
                    ["$scope",
                     "USER_ROLES",
                     "authResource",
                     appCtrl]);

    function appCtrl ($scope, USER_ROLES, authResource) {

		$scope.currentUser = null;
		$scope.userRoles = USER_ROLES;
		$scope.isAuthorized = authResource.isAuthorized;

		$scope.setCurrentUser = function (user) {
			$scope.currentUser = user;
		};

		// TODO: Access control
		// https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec

	}

}());