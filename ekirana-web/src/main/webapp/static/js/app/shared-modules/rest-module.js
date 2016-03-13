'use strict';

var restModule = angular.module('restModule', [ 'ng', 'utilModule' ]);

restModule.value('$rest', {
    servicePath : contextPath + "/rest/",
    userActivitiesPath : "userActivities",
    currentUserPath : "user/current/",
    questionType : "questionType",
});

restModule.config(function($provide, $httpProvider, $compileProvider) {
	
	var loginTimeout = false;
	
	var redirectToLogin = function() {
		var path = contextPath + '/j_spring_security_logout';
		window.location = path;
	};

	var ajaxCallCounter = 0;
	var handleAjaxOverLay = function(start) {
		if (start) {
			if (ajaxCallCounter == 0) {
				var overlay = angular.element(document.querySelector('#overlay'));
				overlay.addClass('overlayOn');
				ajaxCallCounter = 1;
			} else {
				ajaxCallCounter++;
			}
		} else {
			if (ajaxCallCounter == 1) {
				var overlay = angular.element(document.querySelector('#overlay'));
				overlay.removeClass('overlayOn');
				ajaxCallCounter = 0;
			} else {
				ajaxCallCounter--;
			}
		}
	};

	$httpProvider.interceptors.push(function($q, $timeout, $log) {
		return {
			'request' : function(config) {
				config.headers.CALLER = "HTTP-CLIENT";
				handleAjaxOverLay(true);
				return config;
			}
		};
	});

	$httpProvider.responseInterceptors.push(function($q, $timeout, $log/*, utilityService*/) {
		return function(promise) {
			return promise.then(function(successResponse) {
				/** Add condition to pre-process some special cases if needed **/
				handleAjaxOverLay(false);
				return successResponse;
			}, function(errorResponse) {
				handleAjaxOverLay(false);
				//alert(JSON.stringify(errorResponse.data));
				switch (errorResponse.status) {
				case 401:
					//Only if the status is unauthenticated (401) 
					//Check if it's a rest call or an ui call
					//Importing utilityService here causes circular dependency when modalService is imported inside utilityService 
					//due to $modal's share dependency on $http.  Commenting out so we can move handleRestError() code here so it does not
					//have to depend on util module.
					if (errorResponse != undefined && errorResponse.data != undefined && errorResponse.data.httpStatusCode == errorResponse.status) {
						//It's a rest call and provide internationalized error message
				    	var errors;
					    if(errorResponse.data && errorResponse.data.errorType=='AsyncRestError'){
					    	errors = errorResponse.data.data.errors;
					    }else{
					    	errors = errorResponse.data.errors;
					    }
					    var error = errors[0];
					    var errorKey = error.i18nMessageKey;
					    var errorMessage = jQuery.i18n.prop(errorKey);
					    if(!loginTimeout){
					    	alert(errorMessage);
					    	loginTimeout = true;
					    }
					} else {
						//It's an UI call and no message can be provided
						$log.debug("status : " + errorResponse.status + " config = [" + JSON.stringify(errorResponse.config) + "]");
					}
					//And forward to login page
					redirectToLogin();
					return;
				default:
					//For all other 
					return $q.reject(errorResponse);
				}
			});
		};
	});
	//WILL UNCOMMENT & CHANGE IF NACESSARY
	//	$compileProvider.directive('appMessages', function() {
	//		var directiveDefinitionObject = {
	//			link : function(scope, element, attrs) {
	//				// elementsList.push($(element));
	//			}
	//		};
	//		return directiveDefinitionObject;
	//	});
});

/** Symphony REST API call common implementation **/
restModule.factory('restService', function($http, $log, $rest, utilityService) {
	var restService = {
	    getRestData : function(path, successHandler, errorHandler) {
		    path = $rest.servicePath + path;
		    return $http({
		        method : 'GET',
		        url : path
		    }).then(function(response) {
			    $log.debug("Success GET API call -> " + path);
			    if (successHandler && response)
				    return successHandler.call(this, response.data);
			    else
				    return response;
		    }, function(error) {
			    $log.error("Failed GET API call -> " + path + ", error code: " + error.data.httpStatusCode);
			    if (errorHandler)
				    return utilityService.handleRestError(error.data, error.data.httpStatusCode, errorHandler);
			    else {
				    throw {
				        success : false,
				        error : error
				    };
			    }
		    });
	    },
	    postRestData : function(path, data, successHandler, errorHandler) {
		    if (data == undefined) {
			    data = {};
		    }
		    path = $rest.servicePath + path;
		    return $http({
		        method : 'POST',
		        url : path,
		        headers : {
			        'Content-Type' : 'application/x-www-form-urlencoded'
		        },
		        data : $.param(data)
		    }).then(function(response) {
			    $log.debug("Success POST API call -> " + path + " with supplied data = " + JSON.stringify(data));
			    if (successHandler && response)
				    return successHandler.call(this, response.data.data);
			    else
				    return response;
		    }, function(error) {
			    $log.error("Failed POST API call -> " + path + " with supplied data = " + JSON.stringify(data) + ", error code: " + error.data.httpStatusCode);
			    if (errorHandler)
				    return utilityService.handleRestError(error.data, error.data.httpStatusCode, errorHandler);
			    else {
				    throw {
				        success : false,
				        error : error
				    };
			    }
		    });
	    },
	    postRestDataAsJson : function(path, data, successHandler, errorHandler) {
		    if (data == undefined) {
			    data = {};
		    }
		    path = $rest.servicePath + path;
		    return $http({
		        method : 'POST',
		        url : path,
		        headers : {
			        'Content-Type' : 'application/json'
		        },
		        data : data//encodeURIComponent(JSON.stringify(data))
		    }).then(function(response) {
			    $log.debug("Success POST API call -> " + path + " with supplied data = " + JSON.stringify(data));
			    if (successHandler && response)
				    return successHandler.call(this, response.data.data);
			    else
				    return response;
		    }, function(error) {
			    $log.error("Failed POST API call -> " + path + " with supplied data = " + JSON.stringify(data) + ", error code: " + error.data.httpStatusCode);
			    if (errorHandler)
				    return utilityService.handleRestError(error.data, error.data.httpStatusCode, errorHandler);
			    else {
				    throw {
				        success : false,
				        error : error
				    };
			    }
		    });
	    },
	    putRestData : function(path, data, successHandler, errorHandler) {
		    if (data == undefined) {
			    data = {};
		    }
		    path = $rest.servicePath + path;
		    return $http({
		        method : 'PUT',
		        url : path,
		        headers : {
			        'Content-Type' : 'application/x-www-form-urlencoded'
		        },
		        data : $.param(data)
		    }).then(function(response) {
			    $log.debug("Success PUT API call -> " + path + " with supplied data = " + JSON.stringify(data));
			    if (successHandler && response)
				    return successHandler.call(this, response.data.data);
			    else
				    return response;
		    }, function(error) {
			    $log.error("Failed PUT API call -> " + path + " with supplied data = " + JSON.stringify(data) + ", error code: " + error.data.httpStatusCode);
			    if (errorHandler)
				    return utilityService.handleRestError(error.data, error.data.httpStatusCode, errorHandler);
			    else {
				    throw {
				        success : false,
				        error : error
				    };
			    }
		    });
	    },
	    putRestDataAsJson : function(path, data, successHandler, errorHandler) {
		    if (data == undefined) {
			    data = {};
		    }
		    path = $rest.servicePath + path;
		    return $http({
		        method : 'PUT',
		        url : path,
		        headers : {
			        'Content-Type' : 'application/x-www-form-urlencoded'
		        },
		        data : encodeURIComponent(JSON.stringify(data))
		    }).then(function(response) {
			    $log.debug("Success PUT API call -> " + path + " with supplied data = " + JSON.stringify(data));
			    if (successHandler && response)
				    return successHandler.call(this, response.data.data);
			    else
				    return response;
		    }, function(error) {
			    $log.error("Failed PUT API call -> " + path + " with supplied data = " + JSON.stringify(data) + ", error code: " + error.data.httpStatusCode);
			    if (errorHandler)
				    return utilityService.handleRestError(error.data, error.data.httpStatusCode, errorHandler);
			    else {
				    throw {
				        success : false,
				        error : error
				    };
			    }
		    });
	    },
	    deleteRestData : function(path, successHandler, errorHandler) {
		    path = $rest.servicePath + path;
		    return $http({
		        method : 'DELETE',
		        url : path
		    }).then(function(response) {
			    $log.debug("Success GET API call -> " + path);
			    if (successHandler && response)
				    return successHandler.call(this, response.data.data);
			    else
				    return response;
		    }, function(error) {
			    $log.error("Failed GET API call -> " + path + ", error code: " + error.data.httpStatusCode);
			    if (errorHandler)
				    return utilityService.handleRestError(error.data, error.data.httpStatusCode, errorHandler);
			    else {
				    throw {
				        success : false,
				        error : error
				    };
			    }
		    });
	    }
	};
	return restService;
});
