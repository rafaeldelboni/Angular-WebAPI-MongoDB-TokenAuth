(function () {
    "use strict";

    angular
    .module("common.services")
    .factory("authResource",
            ["$resource",
             "$http",
             "sessionService",
             "appSettings",
             "USER_ROLES",
                authResource]);


	function authResource($resource, $http, sessionService, appSettings, USER_ROLES) {
		var authResource = {};

		authResource.login = function (credentials) {
		return $http
		  .post(appSettings.serverPath + '/api/auth', credentials)
		  .then(function (res) {
		    sessionService.create(res.data.id, res.data.user.id,
		                   res.data.user.role);
		    return res.data.user;
		  });
		};

		authResource.isAuthenticated = function () {
			return !!sessionService.userId;
		};

		authResource.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}

			if (authorizedRoles.indexOf(USER_ROLES.all) !== -1) {
				return true;
			} else {

				var userValidRoles = 0;
				if (sessionService.userRole != null) {
					for (var i = 0; i < sessionService.userRole.length; i++) { 
						userValidRoles += 
							authorizedRoles.indexOf(sessionService.userRole[i]) !== -1 ? 1 : 0;
					}
				}

			    return (authResource.isAuthenticated() && userValidRoles > 0);
			}
		};

		return authResource;
	}

}());