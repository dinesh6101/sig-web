var onlineExamApp = angular.module('onlineExamApp', [ 'ngRoute', 'restModule',
		'modalModule', 'utilModule', 'storageModule', 'commonModule' ]);

onlineExamApp.config(function($routeProvider) {

	$routeProvider.when('/viewPaper', {
		templateUrl : contextPath + "/static/html/viewPaper.html",
		controller : 'viewPaperController'
	}).when('/addExam', {
		templateUrl : contextPath + "/static/html/addExams.html",
		controller : 'addExamsController'
	}).when('/setupExam', {
		templateUrl : contextPath + "/static/html/setupExam.html",
		controller : 'setupExamController'
	}).when('/setupPaper', {
		templateUrl : contextPath + "/static/html/setupPaper.html",
		controller : 'setupPaperController'
	}).when('/setupTest', {
		templateUrl : contextPath + "/static/template/setupTest.jsp",
		controller : 'setupTestController'
	}).when('/viewTest', {
		templateUrl : contextPath + "/static/template/viewTest.html",
		controller : 'viewTestController'
	}).when('/addQuestions', {
		templateUrl : contextPath + "/static/template/addQuestions.jsp",
		controller : 'addQuestionsController'
	}).when('/viewQuestionBank', {
		templateUrl : contextPath + "/static/template/viewQuestionBank.html",
		controller : 'viewQuestionBankController'			
	}).otherwise({
		redirectTo : "/"
	});
});

onlineExamApp.controller('addQuestionsController', function($scope, $log,
		$location, $rest, restService) {
	var logger = $log.getLogger("addQuestionsController", true);
	logger.debug(" --- Inside addQuestionsController --- ");
	
	$scope.changeOnMcq=function(){		
	    $scope.multipleChoiceBtnValue = true;  
	    $scope.trueFalseBtnValue = false;
	    $scope.freeTextBtnValue = false;
	    $scope.essayBtnValue = false;
		$scope.setupPaper.questionTypeId = 1;			
	}
	
	$scope.changeOnTrueFalse=function(){		
	    $scope.multipleChoiceBtnValue = false;  
	    $scope.trueFalseBtnValue = true;
	    $scope.freeTextBtnValue = false;
	    $scope.essayBtnValue = false;
		$scope.setupPaper.questionTypeId = 1;			
	}
	
	$scope.changeOnFreeText=function(){		
	    $scope.multipleChoiceBtnValue = false;  
	    $scope.trueFalseBtnValue = false;
	    $scope.freeTextBtnValue = true;
	    $scope.essayBtnValue = false;
		$scope.setupPaperForFreeText.questionTypeId = 2;			

	}
	$scope.changeOnEssay=function(){		
	    $scope.multipleChoiceBtnValue = false;  
	    $scope.trueFalseBtnValue = false;
	    $scope.freeTextBtnValue = false;
	    $scope.essayBtnValue = true;
	}

	$scope.setupPaper = {
			question : "", 
			questionTypeId : "",
			options : []
			};
	
	for(var i=0; i<4; i++){
		var jsonObject = {text:"", isCorrect:false}
		$scope.setupPaper.options.push(jsonObject);
	}
	
	$scope.saveObjectiveQuestion = function() {		
		restService.postRestDataAsJson("saveObjectiveQuestionInQuestionBank", $scope.setupPaper, function(
				resultPromise) {
			var message = "Data Saved ...";
			// utilityService.showMessage('success', message, null, null);
		}, 'warning-all');
	}
	
	$scope.setupPaperForFreeText= {
			question : "", 
			questionTypeId : "",
			answer: ""
			};
		
	$scope.saveFreeTextQuestion = function() {
		
			restService.postRestDataAsJson("saveFreeTextQuestionInQuestionBank", $scope.setupPaperForFreeText, function(
				resultPromise) {
			var message = "Data Saved ...";
			// utilityService.showMessage('success', message, null, null);

		}, 'warning-all');
	}
});

onlineExamApp.controller('viewQuestionBankController', function($scope, $log,
		$location, $rest, restService) {
	var logger = $log.getLogger("viewQuestionBankController", true);
	logger.debug(" --- Inside viewQuestionBankController --- ");

	//view question bank will go here 
});

onlineExamApp.controller('viewTestController', function($scope, $log,
		$location, $rest, restService) {
	var logger = $log.getLogger("viewTestController", true);
	logger.debug(" --- Inside viewTestController --- ");

	$scope.exam = {
			id: "",
		examName : "",
		totalMarks : "",
		minimumMarks : "",
		availableOptions : []
	};

	restService.getRestData("exam", function(data) {
		
		$scope.exam.availableOptions = data;
	}, 'warning-all');
	
	  
		for ( var object in $scope.exam.availableOptions) {
			alert(object);
		        $scope.exam.id = object.id;	
			    $scope.exam.examName = object.examName;	
				$scope.exam.totalMarks = object.totalMarks;
				$scope.exam.minimumMarks = object.minimumMarks;							
		}
		
		
		$scope.addTestBtn=function(){
			$scope.addTestBtnValue=true;
		}
		
		$scope.test = {
				examName : "",
				totalMarks : "",
				minimumMarks : "",
			};
		
		$scope.editBtnValue = true;
		
		$scope.editBtn= function(index){
			alert(index);
			alert($scope.exam.id);
			if(index==$scope.exam.id)
			$scope.editBtnValue = false;		
		}
		
		$scope.saveNewTest = function() {
			logger.debug("data = " + JSON.stringify($scope.test));
			restService.postRestDataAsJson("exam/addUpdate", $scope.test,
					function(resultPromise) {
						var message = "Data Saved ...";
						utilityService.showMessage('success', message, null, null);
					}, 'warning-all');
		}
		
		
});

onlineExamApp.controller('setupTestController', function($scope, $log,
		$location, $rest, restService, utilityService) {
		var logger = $log.getLogger("setupTestController", true);

	$scope.exam = {
		id : "",
		examName : "",
		totalMarks : "",
		minimumMarks : "",
		availableOptions : []
	};

	restService.getRestData("exam", function(data) {
		$scope.exam.availableOptions = data;
	}, 'warning-all');
	
	
	$scope.addNewQuestionBtn=function(){
		$scope.addQuestionBtnValue=true;
		$scope.importQuestionBtnValue=false;
		$scope.selectQuestionBankBtnValue=false;
	}
	
	$scope.importQuestionBtn=function(){
		$scope.addQuestionBtnValue=false;
		$scope.importQuestionBtnValue=true;
		$scope.selectQuestionBankBtnValue=false;
	}
	
	$scope.selectQuestionBankBtn=function(){
		$scope.addQuestionBtnValue=false;
		$scope.importQuestionBtnValue=false;
		$scope.selectQuestionBankBtnValue=true;
	}
	
	$scope.changeOnMcq=function(){		
	    $scope.multipleChoiceBtnValue = true;  
	    $scope.trueFalseBtnValue = false;
	    $scope.freeTextBtnValue = false;
	    $scope.essayBtnValue = false;
		$scope.setupPaper.questionTypeId = 1;			
	}
	
	$scope.changeOnTrueFalse=function(){		
	    $scope.multipleChoiceBtnValue = false;  
	    $scope.trueFalseBtnValue = true;
	    $scope.freeTextBtnValue = false;
	    $scope.essayBtnValue = false;
		$scope.setupPaper.questionTypeId = 1;			
	}
	
	$scope.changeOnFreeText=function(){		
	    $scope.multipleChoiceBtnValue = false;  
	    $scope.trueFalseBtnValue = false;
	    $scope.freeTextBtnValue = true;
	    $scope.essayBtnValue = false;
		$scope.setupPaperForFreeText.questionTypeId = 2;			

	}
	$scope.changeOnEssay=function(){		
	    $scope.multipleChoiceBtnValue = false;  
	    $scope.trueFalseBtnValue = false;
	    $scope.freeTextBtnValue = false;
	    $scope.essayBtnValue = true;
	}

	$scope.setupPaper = {
			question : "", 
			questionTypeId : "",
			options : []
			};
	
	for(var i=0; i<4; i++){
		var jsonObject = {text:"", isCorrect:false}
		$scope.setupPaper.options.push(jsonObject);
	}
	
	$scope.saveObjectiveQuestion = function() {		
		restService.postRestDataAsJson("saveObjectiveQuestionInQuestionBank", $scope.setupPaper, function(
				resultPromise) {
			var message = "Data Saved ...";
			// utilityService.showMessage('success', message, null, null);
		}, 'warning-all');
	}
	
	$scope.setupPaperForFreeText= {
			question : "", 
			questionTypeId : "",
			answer: ""
			};
		
	$scope.saveFreeTextQuestion = function() {
		
			restService.postRestDataAsJson("saveFreeTextQuestionInQuestionBank", $scope.setupPaperForFreeText, function(
				resultPromise) {
			var message = "Data Saved ...";
			// utilityService.showMessage('success', message, null, null);

		}, 'warning-all');
	}
/*	$scope.save = function() {
		logger.debug("data = " + JSON.stringify($scope.exam));
		restService.postRestDataAsJson("/exam/addUpdate", $scope.exam,
				function(resultPromise) {
					var message = "Data Saved ...";
					utilityService.showMessage('success', message, null, null);
				}, 'warning-all');
	}

	$scope.updateType = function() {

		var data = {
			id : $scope.questionType.id,
			type : $scope.questionType.type
		};

		alert("Object = " + data);
		alert("data = " + JSON.stringify(data));

		restService.postRestDataAsJson("/questionType/addUpdate", data,
				function(resultPromise) {
					var message = "Data Updated ...";
					utilityService.showMessage('success', message, null, null);
				}, 'warning-all');
	}

	$scope.deleteType = function() {

		var url = "/questionType/" + $scope.questionType.id;
		restService.deleteRestData(url, function(resultPromise) {
			var message = "Data Deleted ...";
			utilityService.showMessage('info', message, null, null);

			// utilityService.showMessage('Warning', message, null, null);

			// utilityService.showMessage('error', message, null, null);

		}, 'warning-all');
	}*/

});

onlineExamApp.controller('viewPaperController', function($scope, $log,
		$location, $rest, restService) {
	var logger = $log.getLogger("viewPaperController", true);
	logger.debug(" --- Inside viewPaperController --- ");

	$scope.exam = {
		totalMarks : "",
		minimumMarks : "",
		selectedObject : 0,
		availableOptions : []
	};

	restService.getRestData("exam", function(data) {
		$scope.exam.availableOptions = data;
	}, 'warning-all');

	$scope.setupPaper = {
			question : "", 
			marks : "", 
			examId : "", 
			questionTypeId : "",
			options : [],
			availableOptions : []
			};
	
	$scope.newQuestion = {
			question : "", 
			marks : "", 
			examId : "", 
			questionTypeId : "",
			options : [],
			};

	$scope.showPaper = function() {
		for ( var object in $scope.exam.availableOptions) {
			var examObj = $scope.exam.availableOptions[object];
			if (examObj.id == $scope.exam.selectedObject) {
				$scope.exam.totalMarks = examObj.totalMarks;
				$scope.exam.minimumMarks = examObj.minimumMarks;

				restService.getRestData("showQuestionPaper/" + examObj.id,
						function(data) {
							var dt = JSON.stringify(data);
							alert("---"+dt);
							$scope.setupPaper.availableOptions = data;
						}, 'warning-all');		
			}
		}
	}
	
	$scope.editbtn=function(){
		$(".inputdisabled").removeAttr("disabled");
		
	    $scope.editbtnvalue = true;  
	}
	
	$scope.saveupdatebtn=function(){
		
			restService.postRestDataAsJson("updateQuestion", $scope.setupPaper.availableOptions, function(resultPromise) {
			var message = "Data Saved ...";
			utilityService.showMessage('success', message, null, null);
		}, 'warning-all');
			
			
			restService.postRestDataAsJson("saveQuestion", $scope.newQuestion, function(
					resultPromise) {
				var message = "Data Saved ...";
			 utilityService.showMessage('success', message, null, null);

			}, 'warning-all');
	}
	
	$scope.questionType = {
			selectedObject : 0,
			availableOptions : []
		};
	
	$scope.addquestionbtn=function(){
		$scope.addquestionbtnvalue=true;
	}
	
	restService.getRestData("questionType", function(data) {
		$scope.questionType.availableOptions = data;
	}, 'warning-all');
	
	$scope.someDummyModel = false;
	
	$scope.changeRadio = function(index){
		for(var i=0; i<$scope.newQuestion.options.length; i++){
			if(index == i)
				$scope.newQuestion.options[i].isCorrect = true
			else
				$scope.newQuestion.options[i].isCorrect = false
		}
	}

	
	$scope.clearOptions = function(){
		if($scope.newQuestion.questionTypeId == 1){
			for(var i=0; i<4; i++){
				$scope.newQuestion.options[i].isCorrect = false;
			}
		}
	}
	
	for(var i=0; i<4; i++){
		var jsonObject = {text:"", isCorrect:false}
		$scope.newQuestion.options.push(jsonObject);
	}
	
});

onlineExamApp.controller('setupPaperController', function($scope, $log,
		$location, $rest, restService, utilityService) {
	$scope.numberOfQuestionsAdded = 0;

	$scope.exam = {
		selectedObject : 0,
		availableOptions : []
	};

	restService.getRestData("exam", function(data) {
		$scope.exam.availableOptions = data;
	}, 'warning-all');

	$scope.questionType = {
		selectedObject : 0,
		availableOptions : []
	};

	restService.getRestData("questionType", function(data) {
		$scope.questionType.availableOptions = data;
	}, 'warning-all');

	$scope.setupPaper = {
			question : "", 
			marks : "", 
			examId : "", 
			questionTypeId : "",
			options : []
			};
	
	$scope.someDummyModel = false;
	
	$scope.changeRadio = function(index){
		for(var i=0; i<$scope.setupPaper.options.length; i++){
			if(index == i)
				$scope.setupPaper.options[i].isCorrect = true
			else
				$scope.setupPaper.options[i].isCorrect = false
		}
	}
	
	$scope.clearOptions = function(){
		if($scope.setupPaper.questionTypeId == 1){
			for(var i=0; i<4; i++){
				$scope.setupPaper.options[i].isCorrect = false;
			}
		}
	}
	
	for(var i=0; i<4; i++){
		var jsonObject = {text:"", isCorrect:false}
		$scope.setupPaper.options.push(jsonObject);
	}
	
	$scope.saveQuestion = function() {
		$scope.setupPaper.examId = $scope.exam.selectedObject;
		$scope.setupPaper.questionTypeId = $scope.questionType.selectedObject;
				
		restService.postRestDataAsJson("saveQuestion", $scope.setupPaper, function(
				resultPromise) {
			var message = "Data Saved ...";
			// utilityService.showMessage('success', message, null, null);

		}, 'warning-all');
	}

});

onlineExamApp
		.controller(
				'setupExamController',
				function($scope, $log, $location, $rest, restService,
						utilityService) {
					var logger = $log.getLogger("setupExamController", true);

					$scope.exam = {
						selectedObject : 0,
						availableOptions : []
					};

					restService.getRestData("exam", function(data) {
						$scope.exam.availableOptions = data;
					}, 'warning-all');

					$scope.hours = [];
					for (var i = 1; i <= 24; i++) {
						$scope.hours.push(i);
					}
					$scope.mins = [];
					for (var i = 1; i <= 60; i++) {
						$scope.mins.push(i);
					}

					$scope.duration = {
						testDurationHH : "",
						testDurationMM : ""
					}
					$scope.examSetup = {
						examId : "",
						startDate : "",
						endDate : "",
						testDuration : ""
					};

					$scope.savebtn = function() {
						$scope.examSetup.examId = $scope.exam.selectedObject;
						$scope.examSetup.testDuration = parseInt(($scope.duration.testDurationHH * 60))
								+ parseInt($scope.duration.testDurationMM);

						logger.debug("data = "
								+ JSON.stringify($scope.examSetup));

						restService.postRestDataAsJson("/examSetup/addUpdate",
								$scope.examSetup, function(resultPromise) {
									var message = "Data Saved ...";
									utilityService.showMessage('success',
											message, null, null);
								}, 'warning-all');
					}

				});

onlineExamApp.controller('addExamsController', function($scope, $log,
		$location, $rest, restService, utilityService) {
	var logger = $log.getLogger("addExamsController", true);

	$scope.exam = {
		id : "",
		examName : "",
		totalMarks : "",
		minimumMarks : ""
	};

	$scope.save = function() {
		logger.debug("data = " + JSON.stringify($scope.exam));
		restService.postRestDataAsJson("/exam/addUpdate", $scope.exam,
				function(resultPromise) {
					var message = "Data Saved ...";
					utilityService.showMessage('success', message, null, null);
				}, 'warning-all');
	}

	$scope.updateType = function() {

		var data = {
			id : $scope.questionType.id,
			type : $scope.questionType.type
		};

		alert("Object = " + data);
		alert("data = " + JSON.stringify(data));

		restService.postRestDataAsJson("/questionType/addUpdate", data,
				function(resultPromise) {
					var message = "Data Updated ...";
					utilityService.showMessage('success', message, null, null);
				}, 'warning-all');
	}

	$scope.deleteType = function() {

		var url = "/questionType/" + $scope.questionType.id;
		restService.deleteRestData(url, function(resultPromise) {
			var message = "Data Deleted ...";
			utilityService.showMessage('info', message, null, null);

			// utilityService.showMessage('Warning', message, null, null);

			// utilityService.showMessage('error', message, null, null);

		}, 'warning-all');
	}

});
