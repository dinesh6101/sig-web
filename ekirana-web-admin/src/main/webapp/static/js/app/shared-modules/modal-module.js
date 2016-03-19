'use strict';

var modalModule = angular.module('modalModule', [ 'ng', 'ui.bootstrap']);

modalModule.directive('focusedOn', ['$timeout',function($timeout) {
	return {
		link:function(scope, ele, attrs) {
			if(attrs.name == attrs.focusedOn){
				$timeout(function(){
					ele.focus();
				});			
			}
		}
	};	
}]);


modalModule.factory('modalService', function($log, $rootScope, $modal) {

	var OK_BUTTON = 0;
	var YES_BUTTON = 1;
	var KEEP_BUTTON = 2;
	var CANCEL_BUTTON = 3;
	var NO_BUTTON = 4;
	var sizeOfModal = 'sm';
	
	var ModalInstanceCtrl = function ($scope, $modalInstance, message, title, buttons) {
		$scope.message = message;
		$scope.title = title; 
		$scope.buttonArray = [];
		buttons.forEach(function(value) {
			if (value == OK_BUTTON) {
				$scope.buttonArray.push({
					message: "OK",
					buttonFunction: function() {
						$modalInstance.close(OK_BUTTON);
					}
				});
			} else if (value == YES_BUTTON) {
				$scope.buttonArray.push({
					message: "Yes",
					buttonFunction: function() {
						$modalInstance.close(YES_BUTTON);
					}
				});
			} else if (value == KEEP_BUTTON) {
				$scope.buttonArray.push({
					message: "No, keep my changes",
					buttonFunction: function() {
						$modalInstance.close(KEEP_BUTTON);
					}
				});
			} else if (value == CANCEL_BUTTON) {
				$scope.buttonArray.push({
					message: "Cancel",
					buttonFunction: function() {
						$modalInstance.close(CANCEL_BUTTON);
					}
				});
			}else if (value == NO_BUTTON) {
				$scope.buttonArray.push({
					message: "No",
					buttonFunction: function() {
						$modalInstance.close(NO_BUTTON);
					}
				});
			}
		});		
	};
	
	var modalService = {
		OK_BUTTON: OK_BUTTON,
		YES_BUTTON: YES_BUTTON,
		KEEP_BUTTON: KEEP_BUTTON,
		CANCEL_BUTTON: CANCEL_BUTTON,
		NO_BUTTON: NO_BUTTON,		
		
		setSizeOfModalToLarge: function(){
			sizeOfModal ='lg';
		},
		
		openSimpleModal: function(title, modalMessage, buttons) {
			return $modal.open({
				//templateUrl: contextPath +'/ui/template/modal.tpl',
				template: '<link rel="stylesheet" href="'+contextPath+'/static/css/bootstrap/bootstrap-modal.css">' +
						  '<div class="modal-header" data-ng-show="title">' +
						  	'<h3>{{title}}</h3>' +
						  '</div>' +
						  '<div class="modal-body">' +
						  	'<ul>' +
						  		'<li data-ng-repeat="msg in message">{{msg}}</li>' +
						  	'</ul>' +
						  '</div>' +
						  '<div class="modal-footer">' +
							'<button name = "button{{$index + 1}}" data-ng-repeat="btn in buttonArray" data-ng-click="btn.buttonFunction()" focused-on="button1">{{btn.message}}</button>' +
						  '</div>',
				controller: ModalInstanceCtrl,
				size: sizeOfModal,
				resolve: {
					message: function() {
						return modalMessage.split("<br/>");
					},
					title: function() {
						return title;
					},
					buttons: function() {
						return buttons;
					}
				}
			});
		}
	};
	return modalService;
});

