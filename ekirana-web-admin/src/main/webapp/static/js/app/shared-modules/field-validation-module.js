'use strict'; 

var symphonyValidationModule = angular.module('symphonyValidationModule', [ 'ng' ]);

symphonyValidationModule.directive("dynamicName", function($compile) {
	return {
	    restrict : "A",
	    terminal : true,
	    priority : 1000,
	    link : function(scope, element, attrs) {
		    var fieldname = scope.$eval(attrs.dynamicName);
		    if(fieldname != undefined){
			    fieldname = fieldname.toLowerCase().replace(/\s+/g, '');
			    element.attr('name', fieldname);
			    element.removeAttr("dynamic-name");
			    $compile(element)(scope);
		    }
	    }
	};
});

symphonyValidationModule.directive("attrRequired", function($compile) {
	return {
		restrict : "A",
	    link : function(scope, element, attrs) {
	    	element.removeAttr("attr-required");
	    	if(attrs.attrRequired != undefined && scope.$eval(attrs.attrRequired) != undefined){
	    		var fieldname = "" + scope.$eval(attrs.attrRequired);
	    		if(fieldname != undefined && fieldname == "true"){
	    			fieldname = fieldname.toLowerCase().replace(/\s+/g, '');
	    			element.attr('required', fieldname);
	    		}
	    	}
	    	$compile(element)(scope);
	    }
	};
});

symphonyValidationModule.directive('fieldValidator', function($log, $injector) {
	var logger = $log.getLogger("fieldValidator", false);

	logger.debug("Inside directive");

	return {
	    require : "ngModel",
	    //This isolate scope is interfering with the portal date picker's isolate scope
	    //I don't believe it is necessary here and child scope should be used instead'
	    /*scope : {
	    	istovalidate : '@',
	    	required : '@'
	    },*/
	    scope: true,
	    link : function(scope, elm, attrs, ngModel) {
	    	
	    	var msgReqField = jQuery.i18n.prop("val.err.msg.requiredField");
	    	
	    	scope.$watch('istovalidate', function (newValue, oldValue) {
			    if (newValue !== oldValue) {
				    ngModel.$setViewValue(elm.val());
			    	if(attrs.istovalidate != undefined && attrs.istovalidate == "false"){
			    		ngModel.$setValidity('field-validator', true);
			    	}
			    }
            });
	    	
		    elm.on('blur keyup change', function() {
			    scope.$apply(function() {
				    ngModel.$setViewValue(elm.val());
			    });
		    });
		    
		    /**
			logger.debug("attrs.name = " + attrs.name+" & attrs.required = " + attrs.required);
		    logger.debug("attrs.type = " + attrs.type);
		    logger.debug("attrs.name = " + attrs.name);
		    logger.debug("attrs.id = " + attrs.id);
		    */

		    /**if (!ngModel || attrs.type !== 'text' || elm[0].tagName.toLowerCase() !== 'input') {
		        return; // do nothing if no ngModel specified OR the input field is not of type "text"
		    }*/

		    var validationService = undefined;
		    var validationField = undefined;
		    try {
			    validationField = attrs.fieldValidator.toLowerCase().replace(/\s+/g, '');
			    logger.debug("retrieve '" + validationField + "' service factory from injector");
			    validationService = $injector.get(validationField);
		    } catch (e) {
			    logger.error(e);
			    logger.error("No validation factory define with the name " + validationField);
		    }

		    if (validationService != undefined) {
			    var validator = function(value) {
			    	var arg;
			    	
			    	var isRequired = false;
				    if(attrs.required)
				    	isRequired = attrs.required;
					    
			    	var istovalidate = true;
			    	if(attrs.istovalidate != undefined)
			    		istovalidate = attrs.istovalidate;
			    	
			    	arg = {value : value, required : isRequired, istovalidate : istovalidate};
			    	
				    var isFieldValid = true;
				    var validationResult = validationService.isValid(arg);
				    var elementId = "error-" + validationField;
				    var errElement = document.getElementById(elementId);
				    var msg;
				    
				    if ((value == undefined || value.replace(/\s+/g, '') == "") && isRequired == true){
				    	logger.debug("REQUIRED - IN - VALID validationField == "+validationField+" isFieldValid = "+isFieldValid+" value = " + value + " validationResult = " + validationResult.status + "& "+validationResult.message+" isRequired = "+isRequired);
				    	ngModel.$setValidity('field-validator', false);
				    	logger.debug("IN - VALID elementId = "+elementId+" errElement = "+errElement);
					    if(errElement != undefined && isRequired == true){
					    	msg = msgReqField;
					    	$("#"+elementId).html(msg);
					    }
				    }else if((value == undefined || value.replace(/\s+/g, '') == "") && isRequired == false) {
				    	logger.debug("VALID validationField == "+validationField+" isFieldValid = "+isFieldValid+" value = " + value + " validationResult = " + validationResult.status+ "& "+validationResult.message+" isRequired = "+isRequired);
				    	ngModel.$setValidity('field-validator', true);
				    	logger.debug("VALID elementId = "+elementId+" errElement = "+errElement);
					    if (errElement != undefined){
					    	$("#"+elementId).html("");
					    }
				    }else if(validationResult.status == false){
				    	logger.debug("IN - VALID validationField == "+validationField+" isFieldValid = "+isFieldValid+" value = " + value + " validationResult = " + validationResult.status + "& "+validationResult.message+" isRequired = "+isRequired);
				    	ngModel.$setValidity('field-validator', false);
				    	logger.debug("IN - VALID elementId = "+elementId+" errElement = "+errElement);
					    if (errElement != undefined){
					    	msg = validationResult.message;
						    $("#"+elementId).html(msg);
					    }
				    } else {
				    	logger.debug("VALID validationField == "+validationField+" isFieldValid = "+isFieldValid+" value = " + value + " validationResult = " + validationResult.status+ "& "+validationResult.message+" isRequired = "+isRequired);
				    	ngModel.$setValidity('field-validator', true);
				    	logger.debug("VALID elementId = "+elementId+" errElement = "+errElement);
					    if (errElement != undefined){
					    	$("#"+elementId).html("");
					    }
				    }
				    
				    return value;
			    };

			    ngModel.$parsers.unshift(validator);
			    //ngModel.$formatters.unshift(validator);
		    }
	    }
	};
});


/** Required services to validate perticular field **/

var temperature = undefined;

/*Hidden fields*/
symphonyValidationModule.factory('clientdb', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('clientid', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});
symphonyValidationModule.factory('sitenos', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('flag', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('laf', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('badonly', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

/*Common Validations*/
symphonyValidationModule.factory('zipCodeService', function() {
	return {
		isValid : function(arg) {
			var zipCodeRegEx = /^\d{5}(-\d{4})?$/;
			return (zipCodeRegEx.test(arg.value));
		}
	};
});

symphonyValidationModule.factory('setpoint', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			var isSetPointValueValid = false;
			if(positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)){
				if(-5 <= parseInt(arg.value) && parseInt(arg.value) <= 5)
					isSetPointValueValid = true;
			}
			return {
			    "status" : isSetPointValueValid,
			    "message" : jQuery.i18n.prop("val.err.msg.setpoint")
			};
		}
	};
} ]);

symphonyValidationModule.factory('dateService', function() {
	var dateToCompare = undefined;
	return {
	    firstDateIsValid : function(arg) {
		    var bool = false;
		    var message = jQuery.i18n.prop("val.err.msg.date.validFormat");
		    var firstDateRegEx = /^\d{4}-\d{2}-\d{2}$/;
		    if (firstDateRegEx.test(arg.value)) {
			    dateToCompare = arg.value;
			    bool = true;	
		    }
		    else{
		    	message = jQuery.i18n.prop("val.err.msg.date.validFormat");
		    }
		    
		    return {
	    		"status": bool,
	    		"message": message
	    	};
	    },

	    secondDateIsValid : function(arg) {
		    var bool = false;
		    var message = jQuery.i18n.prop("val.err.msg.date.validFormat");
		    var secondDateRegEx = /^\d{4}-\d{2}-\d{2}$/;
		    if (secondDateRegEx.test(arg.value)) {
			    if (dateToCompare != undefined){
		    		if(Date.parse(dateToCompare) <= Date.parse(arg.value)){
		    			bool = true;
		    		}
		    		else{
		    			message = jQuery.i18n.prop("val.err.msg.date.invalidRange");				    	
				    }		    	
			    }	
			    else{
			    	message = jQuery.i18n.prop("val.err.msg.date.invalidFirstField");
			    }		 
		    }
		    else{
		    	message = jQuery.i18n.prop("val.err.msg.date.validFormat");
		    }
		    
		    return {
	    		"status": bool,
	    		"message": message
	    	};
	    }
	};
});

symphonyValidationModule.factory('positiveIntegersService', function() {
	return {
		isValid : function(arg) {
			var positiveIntegerRegEx = /^[0-9]+$/;
			return (positiveIntegerRegEx.test(arg.value));
		}
	};
});

symphonyValidationModule.factory('emailvalidation', function() {
	return {
		isValid : function(arg) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var isValidEmail = true;
			if(arg.value!=null && arg.value!=undefined && arg.value.trim()!='' && arg.istovalidate != undefined && arg.istovalidate == "true"){
				var emails = arg.value.split(',');
				if(emails!=null && emails!=undefined){
					for(var i=0; i < emails.length; i++){
						var email = emails[i].trim();
						isValidEmail = re.test(email);
					}
				}else{
					isValidEmail = false;
				}
			}else{
				isValidEmail = false;
			}
			return {
				"status" : isValidEmail,
				"message" : jQuery.i18n.prop("val.err.msg.invalidEmail")
			};
		}
	};
});

symphonyValidationModule.factory('negativeIntegersService', function() {
	return {
		isValid : function(arg) {
			var negativeIntegerRegEx = /^-[0-9]+$/;
			return (negativeIntegerRegEx.test(arg.value));
		}
	};
});

symphonyValidationModule.factory('decimalValuesService', function() {
	return {
		isValid : function(arg) {
			var decimalRegEx = /^\d+(\.\d{1,})?$/;
			return (decimalRegEx.test(arg.value));
		}
	};
});

symphonyValidationModule.factory('nameService', function() {
	return {
		isValid : function(arg) {
			var nameRegEx = /^[A-Za-z\s]+$/;
			return (nameRegEx.test(arg.value));
		}
	};
});

/*User input fields*/
symphonyValidationModule.factory('latitude', function() {
	return {
		isValid : function(arg) {
			if (arg.value == 90 || arg.value == -90)
				return {
	    		"status": true,
	    		"message": ''
	    	};

			//var latitudeRegEx = /^-?[0-8]?[0-9](\.\d{1,})$/;
			var latitudeRegEx = /(^-?[0-8]?[0-9]$)|(^-?[0-8]?[0-9](\.\d{1,})$)/;
			return {
			    "status" : (latitudeRegEx.test(arg.value)),
			    "message" : jQuery.i18n.prop("val.err.msg.latitude")
			};
		}
	};
});

symphonyValidationModule.factory('longitude', function() {
	return {
		isValid : function(arg) {
			if (arg.value == 180 || arg.value == -180)
				return {
	    		"status": true,
	    		"message": ''
	    	};

			var longitudeRegEx = /(^-?(1?[0-7]?[0-9])$)|(^-?(1?[0-7]?[0-9])(\.\d{1,})$)/;			
			return {
			    "status" : (longitudeRegEx.test(arg.value)),
			    "message" : jQuery.i18n.prop("val.err.msg.longitude")
			};
		}
	};
});

symphonyValidationModule.factory('zip', [ 'zipCodeService', function(zipCodeService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (zipCodeService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.zip")	
			};
		}
	};
} ]);

symphonyValidationModule.factory('radius', [ 'decimalValuesService', function(decimalValuesService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (decimalValuesService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.radius")
			};
		}
	};
} ]);

symphonyValidationModule.factory('after', [ 'dateService', function(dateService) {
	return {
		isValid : function(arg) {			
			return (dateService.firstDateIsValid(arg));
		}
	};
} ]);

symphonyValidationModule.factory('before', [ 'dateService', function(dateService) {
	return {
		isValid : function(arg) {
			return (dateService.secondDateIsValid(arg));
		}
	};
} ]);

symphonyValidationModule.factory('city', [ 'nameService', function(nameService) {
	return {
		isValid : function(arg) {
			return {
				"status":(nameService.isValid(arg)),
				"message":jQuery.i18n.prop("val.err.msg.city")
			};
		}
	};
} ]);

symphonyValidationModule.factory('state', function() {
	return {
		isValid : function(arg) {
			var stateRegEx = /^[A-Za-z]{2}$/;
			return {
				"status":(stateRegEx.test(arg.value)),
				"message":jQuery.i18n.prop("val.err.msg.state")
			};
		}
	};
});

symphonyValidationModule.factory('postalcode', [ 'zipCodeService', function(zipCodeService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (zipCodeService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.postalCode")
			};
		}
	};
} ]);

symphonyValidationModule.factory('username', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('telephone', function() {
	return {
		isValid : function(arg) {
			var telephoneRegEx = /^[\+()-.]?[0-9]+$/;
			return {
			    "status" : (telephoneRegEx.test(arg.value)),
			    "message" : jQuery.i18n.prop("val.err.msg.telephone")
			};
		}
	};
});

symphonyValidationModule.factory('sitenumber', [ 'positiveIntegersService', function(positiveIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.siteNumber")
			};
		}
	};
} ]);

symphonyValidationModule.factory('date', [ 'dateService', function(dateService) {
	return {
		isValid : function(arg) {
			return (dateService.firstDateIsValid(arg));
		}
	};
} ]);

symphonyValidationModule.factory('numofdays', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.validInteger")
			};
		}
	};
} ]);

symphonyValidationModule.factory('startdate', [ 'dateService', function(dateService) {
	return {
		isValid : function(arg) {
			if(arg.required == true || arg.value != "")
				return (dateService.firstDateIsValid(arg));
			else{
				return {
				    "status" : true,
				    "message" : ''
				};
			}
		}
	};
} ]);

symphonyValidationModule.factory('enddate', [ 'dateService', function(dateService) {
	return {
		isValid : function(arg) {
			if(arg.required == true || arg.value != "")
				return (dateService.secondDateIsValid(arg));
			else{
				return {
				    "status" : true,
				    "message" : ''
				};
			}
		}
	};
} ]);

symphonyValidationModule.factory('hvackey', function() {
	return {
		isValid : function(arg) {
			var hvacKeyRegEx = /^[A-Z]+([0-9A-Z]*)?$/;
			return {
			    "status" : (hvacKeyRegEx.test(arg.value)),
			    "message" : jQuery.i18n.prop("val.err.msg.hvacKey")
			};
		}
	};
});

symphonyValidationModule.factory('maxpoolrh', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.validInteger")
			};
		}
	};
} ]);

symphonyValidationModule.factory('maxindoorrh', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.validInteger")
			};
		}
	};
} ]);

symphonyValidationModule.factory('groupid', [ 'positiveIntegersService', function(positiveIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.groupId")
			};			
		}
	};
} ]);

symphonyValidationModule.factory('failcount0', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.validInteger")
			};
		}
	};
} ]);

symphonyValidationModule.factory('baselinegroupid', [ 'positiveIntegersService', function(positiveIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.groupId")
			};	
		}
	};
} ]);

symphonyValidationModule.factory('eventdate', [ 'dateService', function(dateService) {
	return {
		isValid : function(arg) {
			return (dateService.firstDateIsValid(arg));
		}
	};
} ]);

symphonyValidationModule.factory('failcount4', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.validInteger")
			};
		}
	};
} ]);

symphonyValidationModule.factory('comparedate', [ 'dateService', function(dateService) {
	return {
		isValid : function(arg) {
			return (dateService.firstDateIsValid(arg));
		}
	};
} ]);

symphonyValidationModule.factory('ilmgroupname', [ 'nameService', function(nameService) {
	return {
		isValid : function(arg) {
			return {
				"status":(nameService.isValid(arg)),
				"message":jQuery.i18n.prop("val.err.msg.groupName")
			};
		}
	};
} ]);

/*symphonyValidationModule.factory('aftertime', function() {
	return {
		isValid : function(arg) {
			var bool = false;			
			var afterTimeRegEx = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}\s$/;			
			if(afterTimeRegEx.test(arg.value)){					
				if(Date.parse(value) <= Date.now()){
					afterTimeRegEx = value;
					bool = true;
				};
			};
			return bool;
		}
	};
});
*/

symphonyValidationModule.factory('zonetemp', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.validInteger")
			};
		}
	};
} ]);

symphonyValidationModule.factory('jobid', [ 'positiveIntegersService', function(positiveIntegersService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (positiveIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.jobId")
			};	
		}
	};
} ]);

symphonyValidationModule.factory('testing', function() {
	return {
		isValid : function(arg) {
			var bool = false;
			var localValue = arg.value.toLowerCase();
			if (localValue === "false" || localValue === "true")
				bool = true;
			return {
			    "status" : bool,
			    "message" : jQuery.i18n.prop("val.err.msg.boolean")
			};
		}
	};
});

symphonyValidationModule.factory('ipaddress', function() {
	return {
		isValid : function(arg) {
			var ipAdressRegEx = /^[0-9\.]+$/;
			return {
			    "status" : (ipAdressRegEx.test(arg.value)),
			    "message" : jQuery.i18n.prop("val.err.msg.ipAddress")
			};
		}
	};
});

symphonyValidationModule.factory('percentage', [ 'decimalValuesService', function(decimalValuesService) {
	return {
		isValid : function(arg) {
			return {
			    "status" : (decimalValuesService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.percentage")
			};
		}
	};
} ]);

symphonyValidationModule.factory('mintemp', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			temperature = parseInt(arg.value);
			return {
			    "status" : (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)),
			    "message" : jQuery.i18n.prop("val.err.msg.temperature")
			};
		}
	};
} ]);

symphonyValidationModule.factory('maxtemp', [ 'positiveIntegersService', 'negativeIntegersService', function(positiveIntegersService, negativeIntegersService) {
	return {
		isValid : function(arg) {
			var message = jQuery.i18n.prop("val.err.msg.temperature");
			var bool = false;
			if (temperature != undefined) {
				if (positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg)) {
					
					var intValue = parseInt(arg.value);
						if (intValue >= temperature)
							bool = true;
						else 
							message = jQuery.i18n.prop("val.err.msg.maxTemperature");
				}
			}

			else {
				bool = positiveIntegersService.isValid(arg) || negativeIntegersService.isValid(arg);
				message = jQuery.i18n.prop("val.err.msg.temperature");
			}
			return {
			    "status" : bool,
			    "message" : message
			};
		}
	};
} ]);

symphonyValidationModule.factory('username_req', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('siteids', function() {
	return {
		isValid : function(arg) {
			var siteIdsRegEx = /^[0-9,\s]+$/;
			return {
			    "status" : (siteIdsRegEx.test(arg.value) && (arg.value != '')),
			    "message" : jQuery.i18n.prop("val.err.msg.siteId")
			};
		}
	};
});

symphonyValidationModule.factory('comment', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('byuser', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});

symphonyValidationModule.factory('bysite', function() {
	return {
		isValid : function(arg) {
			return {
	    		"status": true,
	    		"message": ''
	    	};
		}
	};
});
