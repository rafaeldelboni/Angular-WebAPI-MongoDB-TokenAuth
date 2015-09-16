(function () {
    "use strict";

    angular
        .module("movieHunter")
        .controller("MovieDetailCtrl",
                    ["$scope",
                     "$routeParams",
                     "$location",
                     "movieResource",
                     "authResource",
                     "USER_ROLES",
                     MovieDetailCtrl]);

    function MovieDetailCtrl ($scope, $routeParams, $location, movieResource, authResource, USER_ROLES) {
        $scope.movieId = $routeParams.movieId;

		movieResource.getMovies().get({ movieId: $scope.movieId },
            function (data) {
                $scope.movie = data;
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
				movieResource.getMovies().delete({ movieId: $scope.movieId },
					function (data) {
		                $location.path('/searchByTitle');
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