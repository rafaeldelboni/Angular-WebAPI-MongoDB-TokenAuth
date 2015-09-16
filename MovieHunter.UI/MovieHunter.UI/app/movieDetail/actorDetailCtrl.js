(function () {
    "use strict";

    angular
        .module("movieHunter")
        .controller("ActorDetailCtrl",
                    ["$scope",
                     "$routeParams",
                     "$location",
                     "actorResource",
                     "authResource",
                     "USER_ROLES",
                     ActorDetailCtrl]);

    function ActorDetailCtrl ($scope, $routeParams, $location, actorResource, authResource, USER_ROLES) {
        $scope.actorId = $routeParams.actorId;

		actorResource.getActors().get({ actorId: $scope.actorId },
            function (data) {
                $scope.actor = data;
            },
            function (response) {
                $scope.errorText = response.message + "\r\n";
                if (response.data && response.data.exceptionMessage)
                    $scope.errorText += response.data.exceptionMessage;
            }
        );

		$scope.delete = function() {
			var authorizedRoles = [USER_ROLES.admin, USER_ROLES.editor];

			if(authResource.isAuthorized(authorizedRoles)) {
				actorResource.getActors().delete({ actorId: $scope.actorId },
					function (data) {
		                $location.path('/searchByActor');
		            },
		            function (response) {
		                $scope.errorText = response.message + "\r\n";
		                if (response.data && response.data.exceptionMessage)
		                    $scope.errorText += response.data.exceptionMessage;
		            }
	        	);
        	}
		};
    }
}());