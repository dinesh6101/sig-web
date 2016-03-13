/**
 * 
 */

var home = angular.module('home', [ 'ngRoute', 
                                    'restModule',
                                    'modalModule',
                                    'utilModule', 
                                    'storageModule', 
                                    'commonModule' ]);

home.controller('homeController',function($scope, $log, $location, $rest, restService) {
		var logger = $log.getLogger("homeController", true);
		
		$scope.itemss = {};
		
		restService.getRestData("/items", function(resultPromise) {
			$scope.itemss = resultPromise;
		}, 'warning-all');
		
});

