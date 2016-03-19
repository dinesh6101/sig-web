var clientApp = angular.module('auaApp', [ 'ngCookies', 'utilModule','restModule','commonModule','modalModule' ]);
clientApp.controller('auaCntlr', function($scope, $rest, restService, modalService, utilityService) {
	var ua = window.navigator.userAgent;
    var msie = false; 
    if(ua.indexOf("MSIE ")>0){
    	msie = true;
    }
    var displayMessage = function(message, obj){
    	if(msie){
    		alert(message);
			$(obj).focus();
			$scope.loading = false;
    	}else{
	    	var buttons = [modalService.OK_BUTTON];
	    	var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.symphonyAcceptUA'),message,buttons);
			modal.result.then(function(){
				$(obj).focus();
				$scope.loading = false;
			},function(){
				$(obj).focus();
				$scope.loading = false;
			});
    	}
    };
	
	$scope.userName = un;
	$scope.loading = false;
	$("#touSelection").focus();
	restService.getRestData('user/useragreement?userName='+$scope.userName, function(userAgreement) {
		$scope.agreementId = userAgreement.agreementId;
		$scope.fileName = userAgreement.filename;
		$("#touFrame").attr("src",arepo+userAgreement.filename);
	},function(errorMsg){
		displayMessage(errorMsg, "#touFrame");
	});
	
	
	
	$scope.validateAndSubmit = function() {
		$scope.loading = true;
		
		var data = {};
		//alert($scope.touSelection);
		data.userName = $scope.userName;
		data.password = $scope.newPassword;
		data.verifyPassword = $scope.reenterPassword;
		data.securityKey = sc;
		
		if($.trim(data.userName)==''){
//			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.symphonyAcceptUA'),jQuery.i18n.prop('err.msg.enterUserName'),buttons);
//			modal.result.then(function(){
//				$("#userName").focus();
//				$scope.loading = false;
//			});
			displayMessage(jQuery.i18n.prop('err.msg.enterUserName'),"#userName");
		}else if($.trim(data.password)==''){
//			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.symphonyAcceptUA'),jQuery.i18n.prop('err.msg.enterPassword'),buttons);
//			modal.result.then(function(){
//				$("#newPassword").focus();
//				$scope.loading = false;
//			});
			displayMessage(jQuery.i18n.prop('err.msg.enterPassword'),"#newPassword");
		}else if($.trim(data.verifyPassword)==''){
//			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.symphonyAcceptUA'),jQuery.i18n.prop('err.msg.reenterPassword'),buttons);
//			modal.result.then(function(){
//				$("#reenterPassword").focus();
//				$scope.loading = false;
//			});
			displayMessage(jQuery.i18n.prop('err.msg.reenterPassword'),"#reenterPassword");
		}else if($scope.touSelection != true){
//			var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.symphonyAcceptUA'),jQuery.i18n.prop('err.msg.acceptTou'),buttons);
//			modal.result.then(function(){
//				alert('i am here');
//				$("#reenterPassword").focus();
//				$scope.loading = false;
//			}, function(){
//				alert('failed');
//			});
			displayMessage(jQuery.i18n.prop('err.msg.acceptTou'),"#touSelection");
		}else{
			data.agreementId = $scope.agreementId;
			restService.postRestData('user/useragreement', data, function(result) {
//				var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.symphonyAcceptUA'),jQuery.i18n.prop(result.i18nMessageKey),buttons);
//				modal.result.then(function(){
//					var path = contextPath + '/ui/login.html?re-login';
//					window.location = path;
//				},function(){
//					alert('');
//					
//				});
		    	if(msie){
		    		alert(jQuery.i18n.prop(result.i18nMessageKey));
					var path = contextPath + '/ui/login.html?re-login';
					window.location = path;
					$scope.loading = false;
		    	}else{
			    	var buttons = [modalService.OK_BUTTON];
			    	var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.symphonyAcceptUA'),jQuery.i18n.prop(result.i18nMessageKey),buttons);
					modal.result.then(function(){
						var path = contextPath + '/ui/login.html?re-login';
						window.location = path;
						$scope.loading = false;
					},function(){
						var path = contextPath + '/ui/login.html?re-login';
						window.location = path;
						$scope.loading = false;
					});
		    	}
			},function(errorMessage){
//				$scope.loading = false;
//				utilityService.showMessage('acknowledge', errorMessage, null, null);
//				modal.result.then(function(){
//					$scope.loading = false;
//					var path = contextPath + '/ui/login.html?re-login';
//					window.location = path;
//				});
				displayMessage(errorMessage,"#touSelection");
			});
		}
	}
});
