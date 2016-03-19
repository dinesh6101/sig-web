var app = angular.module('loginApp', [ 'ngCookies', 'utilModule','restModule','commonModule','modalModule' ]);
app.controller('loginCntlr', function($scope, $rest, $cookies, restService, modalService, utilityService) {
	$scope.loading = false;
	$scope.j_username = "dinesh.bhavsar@siemens.com";
	$scope.j_password = "Dinesh123";
	$scope.rememberUser = function(){
		if($cookies.REMEMBER_USER==undefined || $cookies.REMEMBER_USER == null || $cookies.REMEMBER_USER == ''){
			$scope.j_username = '';
			$("#j_username").focus();
		}else{
			$scope.j_username = $cookies.REMEMBER_USER;
			$("#j_password").focus();
		}
	}
	
	locateHomePage = function (){
		window.location.replace('home.html');
	}
	
	$scope.validateAndSubmit = function(){
		$scope.loading = true;
		var data = {};
		data.j_username = $scope.j_username;
		data.j_password = $scope.j_password;
		var buttons = [modalService.OK_BUTTON];
		if($.trim(data.j_username)==''){
			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.login'),jQuery.i18n.prop('err.msg.enterUserName'),buttons);
			modal.result.then(function(){
				$("#j_username").focus();
				$scope.loading = false;
			});
		}else if($.trim(data.j_password)==''){
			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.login'),jQuery.i18n.prop('err.msg.enterPassword'),buttons);
			modal.result.then(function(){
				$("#j_password").focus();
				$scope.loading = false;
			});
		}else{
			restService.postRestData('login', data, function(result) {
				//locateHomePage(result.userClass.classType);
				locateHomePage();
			},function(errorMessage) {
				$scope.loading = false;
				utilityService.showMessage('acknowledge', errorMessage, null, null);
			});
		}
		
	};
	$scope.forgotPassword = function() {
		$('#loginDiv').hide();
		$('#resetPwdDiv').show();
		$("#fp_username").focus();
	}
	$scope.requestPasswordReset = function() {
		var data = {};
		data.userName = $scope.fp_username;
		var buttons = [modalService.OK_BUTTON];
		if($.trim(data.userName)==''){
			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.resetPassword'),jQuery.i18n.prop('err.msg.enterUserName'),buttons);
			modal.result.then(function(){
				$("#fp_username").focus();
			});
		}else {
			restService.postRestData('user/requestresetpassword', data, function(result) {
				var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.resetPassword'),jQuery.i18n.prop(result.i18nMessageKey),buttons);
				modal.result.then(function(){
					var path = contextPath + '/ui/login.html?re-login';
					window.location = path;
				});
			},'acknowledge-all');
		}		
	}
});

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
