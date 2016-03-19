'use strict';

var usrPermissionModule = angular.module('usrPermissionModule', ['ng','utilModule', 'storageModule']);
usrPermissionModule.factory('permissionService',function($log, $rest, $http, utilityService, contextStorage) {
	var logger = $log.getLogger("permissionService", false);
	var accessTokens = [];
	function checkPermissionFor(key){
		if(accessTokens[0]=='ALL'){
			return true;
		}else{
			for (var i = 0; i < accessTokens.length; i++){
				if (accessTokens[i]==key){
					return true;
				}
			}
			return false;
		}
	};
	
	var permService = {
		setPermissionBasedVisibility: function(key,element){
			var userData = contextStorage.getCurrentUserData();
			if (userData) {
				if (userData.accessTokens) {
					accessTokens = userData.accessTokens;
				}
			}
			if(accessTokens.length==0){
				logger.debug("Number of access tokens: "+accessTokens.length);
				$http({method: 'GET', url: $rest.servicePath + $rest.currentUsersAccessTokensPath}).
			    success(function(data, status, headers, config) {
    				accessTokens = data.data.tokens;
    	        	var permission = checkPermissionFor(key);
    	        	if(!permission){
    	        		element.hide();
    	        	}
			    }).
			    error(function(data, status, headers, config) {
			    	utilityService.showMessage('warning','Failed to retrieve permission for current user, hiding functionality');
			    	element.hide();
			    });
			}else{
				logger.debug("Number of access tokens: "+accessTokens.length);
	        	var permission = checkPermissionFor(key);
	        	if(!permission){
	        		element.hide();
	        	}
			}
		},
		userHasRole: function(role) {
			var userData = contextStorage.getCurrentUserData();
			if (userData) {
				if (userData.accessTokens) {
					accessTokens = userData.accessTokens;
				}
			}
			if(accessTokens.length==0){
				logger.debug("Number of access tokens: "+accessTokens.length);
				$http({method: 'GET', url: $rest.servicePath + $rest.currentUsersAccessTokensPath}).
			    success(function(data, status, headers, config) {
    				accessTokens = data.data.tokens;
    	        	return checkPermissionFor(role);
			    }).
			    error(function(data, status, headers, config) {
			    	return false;
			    });
			}else{
				logger.debug("Number of access tokens: "+accessTokens.length);
	        	return checkPermissionFor(role);
			}
		}
	}; 
	return permService;
});

usrPermissionModule.directive("accessControl",function($log, permissionService) {
	var logger = $log.getLogger("accessControl", false);
	return {
        restrict: 'A',
        link: function (scope, element,attributes) {
        	var key = attributes.accessControl;
        	logger.debug('in access control directive');
        	permissionService.setPermissionBasedVisibility(key,element);
        }
      };
});