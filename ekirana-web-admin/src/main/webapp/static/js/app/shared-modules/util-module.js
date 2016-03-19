'use strict';

var utilModule = angular.module('utilModule', [ 'ng','ngCookies', 'modalModule']);

/** Symphony localization implementation **/

utilModule.factory('utilityService', function($log, $cookies, $rootScope, modalService) {
    toastr.options = {
            closeButton: true,
            debug: false,
            positionClass: 'toast-bottom-right',
            onclick: null
        };

        toastr.options.showDuration = 500;
        toastr.options.hideDuration = 1000;
        toastr.options.timeOut = 10000;
        toastr.options.extendedTimeOut = 1000;
        toastr.options.showEasing = 'swing';//'easeOutBounce';
        toastr.options.hideEasing = 'linear';//'easeInBack';
        toastr.options.showMethod = 'fadeIn';//'slideDown';
        toastr.options.hideMethod = 'fadeOut';//'slideUp';
        var toastrShortCutFunction = 'Info';  
	var utilService = {
		showMessage: function(type, message, code, ignoreCodes) {
			if(ignoreCodes){
				if(ignoreCodes.indexOf(code)!=-1){
					return;
				}
			}else{
				var title = "";
				if(type=='success'){
					title = 'Success';
				}else if(type=='info'){
					title = 'Info';
				}else if(type=='warning'){
					title = 'Warning';
				}else if(type=='error'){
					title = 'Error';
				}else if(type=='acknowledge'){
					modalService.openSimpleModal("", message, [modalService.OK_BUTTON]);
					return;
				}else if(type!=null){
					$rootScope[type] = message;
					return;
				}else{
					//Error no type is specified
					return;
				}
				var $toast = toastr[type](message, title);
			}
		},
	    loadLanguage : function() {
		    try {
		    	//alert($cookies.language);
		    	if($cookies.language==undefined || $cookies.language == null){
		    		//Setting default language
		    		$cookies.language = 'en_US';
		    	}
		    	
			    jQuery.i18n.properties({
			        name : 'Messages',
			        path : contextPath + '/static/resources/messages/',
			        mode : 'both',
			        language : $cookies.language,
			        callback : function() {
				        //nothing to do
			        }
			    });
		    } catch (e) {
		    	this.showMessage('acknowledge',"Loading of specific language: " + $cookies.language + " failed. Error Message: " + e.message,null,null);
			    throw e;
		    }
	    },
	    handleRestError : function(restErrorResponse, restErrorCode, errorHandler) {
	    	var message;
		    if (restErrorResponse != null && restErrorResponse != undefined && restErrorResponse != "") {
			    try {
			    	message = this.extractI18NErrorMessage(restErrorResponse);
			    } catch (e) {
				    var localRestError = this.createClientRestError(500, 500, "SERVER_ERROR", "Parsing JSON String failed", "fe_client.err.msg.json.parsingFailed", "", "");
				    message = this.extractI18NErrorMessage(localRestError);
			    }
			    this.displayError(message, restErrorCode, errorHandler);
		    } else {
			    var localRestError = this.createClientRestError(code, code, "CLIENT_ERROR", "There is an error to communicate with the server", "fe_client.err.msg.communicationError", "", "");
			    this.displayError(this.extractI18NErrorMessage(localRestError), restErrorCode, errorHandler);
		    }
	    },
	    extractI18NErrorMessage : function(errorResponse) {
	    	var errors;
		    if(errorResponse.data && errorResponse.data.type=='AsyncRestError'){
		    	errors = errorResponse.data.errors;
		    }else{
		    	errors = errorResponse.errors;
		    }
		    if (errors != null && errors != undefined && errors.length > 0) {
			    if (errors.length == 1) {
				    var error = errors[0];
				    var errorKey = error.i18nMessageKey;
				    var errorMessage = jQuery.i18n.prop(errorKey);
				    var mesgReplacements = error.messageReplacements;
				    if (mesgReplacements != null && mesgReplacements != undefined && mesgReplacements.length > 0) {
				    	try{
					    $.each(mesgReplacements, function(index, msgReplacement) {
						    errorMessage = errorMessage.replace('${' + msgReplacement.key + '}', msgReplacement.value);
					    });
				    	}catch(e){
				    		this.showMessage('warning', e.message, null, null);
				    	}
				    }
				    return errorMessage;
			    } else {
				    //TODO
				    //NOT YET IMPLEMENTED
				    //Handle multiple errors if the response returning multiple rest error
				    return "Handling multiple errors not yet implemented.";
			    }
		    } else {
			    return "Error occurred: Problem processing error message, no specific error returned.";
		    }
	    },
	    // get translated msg, replacing keys if provided
		getTranslatedMsg : function(msgKey, msgReplacements) {  
			var msg = jQuery.i18n.prop(msgKey);
			if (msgReplacements && msgReplacements.length > 0) {
				try {
					angular.forEach(msgReplacements, function(msgReplacement) {
						msg = msg.replace('${' + msgReplacement.key + '}', 
												msgReplacement.value);
					});
				} catch (e) {
					console.log("Error converting I18N message " + msgKey + ".  Error msg = " + e.message);
				}
			}
			return msg;
		},
	    createClientRestError : function(httpStatusCode, errorCode, errorType, errorMessage, i18nMessageKey, i18nMessageReplacementKey, i18nMessageReplacementValue) {
		    var clientRestErrorMessage = {
		        errors : [ {
		            "errorCode" : errorCode,
		            "errorType" : errorType,
		            "errorMessage" : errorMessage,
		            "i18nMessageKey" : i18nMessageKey,
		            "messageReplacements" : [ {
		                "key" : i18nMessageReplacementKey,
		                "value" : i18nMessageReplacementValue
		            } ]
		        } ],
		        "httpStatusCode" : httpStatusCode,
		        "resourceLocation" : null
		    };
		    return clientRestErrorMessage;
	    },
	    displayError : function(message, restErrorCode, errorHandler) {
		    if (errorHandler == 'alert') {
			    alert(message);
		    } else if(errorHandler == 'error-all'){
		    	this.showMessage('error', message, restErrorCode, null);
		    } else if(errorHandler == 'warning-all'){
		    	this.showMessage('warning', message, restErrorCode, null);
		    } else if(errorHandler == 'info-all'){
		    	this.showMessage('info', message, restErrorCode, null);
		    } else if(errorHandler == 'acknowledge-all'){
		    	this.showMessage('acknowledge', message, restErrorCode, null);
		    } else if(errorHandler == 'success-all'){
		    	this.showMessage('success', message, restErrorCode, null);
		    } else {
			    var functionType = {};
			    if (errorHandler && functionType.toString.call(errorHandler) === '[object Function]') {
				    errorHandler.call(this, message, restErrorCode);
			    } else {
			    	this.showMessage(errorHandler, message, restErrorCode, null);
			    }
		    }
	    },
		assocateRanking: function(sites,ranks){
			for(var j=0; j<ranks.length; j++){
				var rank = ranks[j];
				var rsiteId = rank.siteId;
				for(var i=0; i<sites.length; i++){
					var site = sites[i];
					var ssiteId = site.siteId;
					if(ssiteId==rsiteId){
						site.ranking = rank.ranksMap;
						break;
					}
				}
			}
		},
	    giteTitle: function(site,$scope){
	    	var title = "";
	    	if(site != null){
	    		title = site.siteNumber;
	    		if((site.storeName != null) && (site.storeName.length > 0)) {
	    			title += " / ";
	    			title += site.storeName;
	    		}
	    	}
			
			if($scope != null){
				$scope.siteTitle = title;
			}
			return title;
	    }
	};
	
	return utilService;
});


/** Symphony logger implementation **/
utilModule.provider('logger', function() {
	this.loggingPattern = '%s - %s: ';

	this.$get = function() {
		var loggingPattern = this.loggingPattern;
		return {
			enhanceAngularLog : function($log) {
				$log.enabledContexts = [];

				$log.getLogger = function(context, enableLogging) {
					enableLogging == undefined ? true : enableLogging;
					context == undefined || context == "" ? "Symphony" : context;
					$log.enabledContexts[context] = enableLogging;
					return {
					    log : enhanceLogging($log.log, context, loggingPattern),
					    info : enhanceLogging($log.info, context, loggingPattern),
					    warn : enhanceLogging($log.warn, context, loggingPattern),
					    debug : enhanceLogging($log.debug, context, loggingPattern),
					    error : enhanceLogging($log.error, context, loggingPattern),
					    enableLogging : function(enable) {
						    $log.enabledContexts[context] = enable;
					    }
					};
				};

				function enhanceLogging(loggingFunc, context, loggingPattern) {
					return function() {
						var contextEnabled = $log.enabledContexts[context];
						if (contextEnabled === undefined || contextEnabled) {
							var modifiedArguments = [].slice.call(arguments);
							modifiedArguments[0] = [ sprintf(loggingPattern, context, new Date().toLocaleTimeString()) ] + modifiedArguments[0];
							loggingFunc.apply(null, modifiedArguments);
						}
					};
				}

				function sprintf(format, etc) {
					var arg = arguments;
					var i = 1;
					return format.replace(/%((%)|s)/g, function(m) {
						return m[2] || arg[i++];
					});
				}
			}
		};
	};
}).config([ 'loggerProvider', function(loggerProvider) {
	loggerProvider.loggingPattern = '%s | [%s] > ';
} ]).run([ '$log', 'logger', function($log, logger) {
	logger.enhanceAngularLog($log);
} ]);
