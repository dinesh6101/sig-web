/**
 * 
 */

var onlineExamApp = angular.module('onlineExamApp', [ 'ngRoute', 
                                                        'restModule', 
                                                        'modalModule',
                                                        'utilModule',
                                                        'storageModule', 
                                                        'commonModule' ]);

onlineExamApp.config(function($routeProvider) {

	$routeProvider.when('/viewExams', {
	    templateUrl : contextPath + "/static/html/viewExams.html",
	    controller : 'viewExamsController'
	}).when('/addExam', {
	    templateUrl : contextPath + "/static/html/addExams.html",
	    controller : 'addExamsController'
	}).otherwise({
		redirectTo : "/"
	});
});

onlineExamApp.controller('viewExamsController', function($scope, $log, $location, $rest, restService) {
	var logger = $log.getLogger("viewExamsController", true);
	
	logger.debug(" --- Inside viewExamsController --- ");
	
	restService.getRestData("questionType", function(data) {
		$scope.questionTypes = data;
	}, 'warning-all');
});

onlineExamApp.controller('addExamsController', function($scope, $log, $location, $rest, restService, utilityService) {
	var logger = $log.getLogger("addExamsController", true);
	
	$scope.questionType = { id: "", type: "" };
	
	$scope.saveType = function(){
		
		var data = { type:$scope.questionType.type };
		
		alert("Object = "+data);
		alert("data = "+JSON.stringify(data));
		
		var fun = function(resultPromise) {
			var message = "Data Saved ...";
			utilityService.showMessage('acknowledge', message, null, null);
		}
		
		restService.postRestDataAsJson("/questionType/addUpdate",data, fun, 'warning-all');
	}
	
	$scope.updateType = function(){
		
		var data = {id: $scope.questionType.id, type:$scope.questionType.type};
		
		alert("Object = "+data);
		alert("data = "+JSON.stringify(data));
		
		restService.postRestDataAsJson("/questionType/addUpdate",data, function(resultPromise) {
			var message = "Data Updated ...";
			utilityService.showMessage('success', message, null, null);
		}, 'warning-all');
	}
	
	$scope.deleteType = function(){
		
		var url = "/questionType/" + $scope.questionType.id;
		restService.deleteRestData(url, function(resultPromise) {
			var message = "Data Deleted ...";
			utilityService.showMessage('info', message, null, null);
			
			//utilityService.showMessage('Warning', message, null, null);
			
			//utilityService.showMessage('error', message, null, null);
			
		}, 'warning-all');
	}
	
});

