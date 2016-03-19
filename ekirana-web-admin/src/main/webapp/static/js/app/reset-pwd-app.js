var clientApp = angular.module('resetPwdApp', [ 'ngCookies', 'utilModule','restModule','commonModule','modalModule' ]);
clientApp.controller('resetPwdCntlr', function($scope, $rest, restService, modalService, utilityService) {
	$scope.loading = false;
	$("#newPassword").focus();
	$scope.username = un;
	$scope.validateAndSubmit = function(){
		$scope.loading = true;
		var data = {};
		data.userName = $scope.username;
		data.password = $scope.newPassword;
		data.verifyPassword = $scope.reenterPassword;
		data.securityKey = sc;
		var buttons = [modalService.OK_BUTTON];
		if($.trim(data.userName)==''){
			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.resetPassword'),jQuery.i18n.prop('err.msg.enterUserName'),buttons);
			modal.result.then(function(){
				$("#username").focus();
				$scope.loading = false;
			});
		}else if($.trim(data.password)==''){
			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.resetPassword'),jQuery.i18n.prop('err.msg.enterPassword'),buttons);
			modal.result.then(function(){
				$("#newPassword").focus();
				$scope.loading = false;
			});
		}else if($.trim(data.verifyPassword)==''){
			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.resetPassword'),jQuery.i18n.prop('err.msg.reenterPassword'),buttons);
			modal.result.then(function(){
				$("#reenterPassword").focus();
				$scope.loading = false;
			});
		}else{
			restService.postRestData('user/resetpassword', data, function(result) {
				var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.resetPassword'),jQuery.i18n.prop(result.i18nMessageKey),buttons);
				modal.result.then(function(){
					var path = contextPath + '/ui/login.html?re-login';
					window.location = path;
				});
			},function(errorMessage){
				utilityService.showMessage('acknowledge', errorMessage, null, null);
				$scope.loading = false;
			});
		}
	}
});
