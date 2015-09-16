(function () {
    "use strict";

    angular
    .module("common.services")
    .factory("authResource",
            ["$resource",
             "$http",
             "sessionService",
             "appSettings",
                authResource]);


	function authResource($resource, $http, sessionService, appSettings) {
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
	    return (authService.isAuthenticated() &&
	      authorizedRoles.indexOf(sessionService.userRole) !== -1);
	  };
	 
	  return authResource;
	}

}());