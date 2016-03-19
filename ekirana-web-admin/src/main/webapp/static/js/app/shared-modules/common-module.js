'use strict';

var childCalling = function(parentId, $window, data){
	// close child window before calling parent method
	// since the parent method may take a long time
	// if it gets data from the server
	$window.close();   
	
	parentId = '#'+parentId;
	var scope = angular.element($(parentId)).scope();
	 scope.$apply(function(){
	        scope.childCallReceived(data);
	 });
};

var commonModule = angular.module('commonModule', [ 'ng','utilModule','restModule','storageModule','ui.bootstrap']);

commonModule.controller('CommonDataController', function($rootScope, $scope, $log, $location, searchFilter, $rest, restService, contextStorage, utilityService, $modal, $sce) {
	var logger = $log.getLogger("CommonDataController", false);
	logger.debug("Inside CommonDataController");
	$scope.bulletins = null;
	$scope.searchFilter = searchFilter;
	$scope.timestamp = (new Date()).toUTCString();
	var userData = contextStorage.getCurrentUserData();
	if(userData==null){
		restService.getRestData($rest.currentUserPath, function(userData) {
			//var userAgreementDate = userData.agreementDate.textRepresentation;
			//if(userAgreementDate!=null){
				//userData.userAgreementDate = userAgreementDate.split(" ")[0];
			//}
			contextStorage.setCurrentUserData(userData);
			$scope.userData = userData;
			/*if (arepo != null && arepo != '') {
				restService.getRestData('user/useragreement?userName='+userData.user.username, function(userAgreement) {
			    	$scope.fileName = arepo+userAgreement.filename;
				},'acknowledge-all');
			}*/
	    }, 'error-all');
	}else{
		$scope.userData = userData;
	}
	$scope.client = contextStorage.getCurrentClient();
	
	$scope.loadBulletins = function() {
		var url = $rest.bulletins + $scope.client.id;
		logger.debug("Bulletin URL: " + url);
		restService.getRestData(url,function(successResponse) {
			logger.debug("---------got bulletins--------" + JSON.stringify(successResponse));
			$scope.bulletins = successResponse;
			setBulletinProperties();
		},function(emsg,ecode){
			//utilityService.showMessage('warning',emsg,ecode,[404]);
			logger.debug("No Bulletins.");
		});
	};
	
	$scope.acknowledgeBulletin = function($event, bulletinId) {
		//prevent notification click from happening (the expanded notification text)
		$event.stopPropagation();
		var url = $rest.bulletin_ack + bulletinId;
		restService.postRestData(url, null, function(successResponse) {
			//reload to get new count and show recently ack'd
			$scope.loadBulletins();
		}, function(emsg,ecode) {			    
		    utilityService.showMessage('error',emsg, ecode, null);
	    });
	}
	
	var setBulletinProperties = function() {
		var unack = 0;
		angular.forEach($scope.bulletins, function(value, key) {
			if (!value.acknowledged) {
				unack++;
			}
			if (value.urgency >= 0 && value.urgency < 3) {
				var imgNum = value.urgency + 1;
				value.image = "excep" + imgNum + ".png";
			} else if (value.urgency < 0) {
				value.image = "excep1.png";
			} else {
				value.image = "excep4.png";
			}
		});
		$scope.bulletins.unackCount = unack;
		if ($scope.bulletins.unackCount > 99) {
			$scope.bulletins.unackCountText = "99+";
		} else {
			$scope.bulletins.unackCountText = $scope.bulletins.unackCount;
		}
	}
	
	$scope.toggleNotifications = function() {
		$("#notifications-div").toggle();
	}
	
	$scope.toggleFullNotification = function($event) {
		//see if notification text overflows... If not, be sure to (re)add necessary classes
		if ($($event.currentTarget).children(".notification-text")[0].scrollHeight > $($event.currentTarget).children(".notification-text").innerHeight() ||
			$($event.currentTarget).children(".notification-text")[0].scrollWidth > $($event.currentTarget).children(".notification-text").innerWidth() ) {
			$($event.currentTarget).parent().toggleClass("notification-fixed");
			$($event.currentTarget).children(".notification-text").toggleClass("notification-text-hide-overflow");
			$($event.currentTarget).children(".notification-text").toggleClass("notification-text-expanded");
		} else {
			$($event.currentTarget).addClass("notification-overlay");
			$($event.currentTarget).parent().addClass("notification-fixed");
			$($event.currentTarget).children(".notification-text").addClass("notification-text-hide-overflow");
			$($event.currentTarget).children(".notification-text").removeClass("notification-text-expanded");
		}
	}
	
	$scope.trust_as_html = function(value) {
	    return $sce.trustAsHtml(value);
	};

	$scope.getSiteTitle = function(site) {
		return utilityService.giteTitle(site, null);
	};
	$scope.getSiteDZR = function(site) {
		var dzr = "";
		if(site.type == "SiteLite") {
			if(site.districtName != null) {
				dzr = site.districtName;
				if(site.zoneName != null) {
					dzr = dzr + "-" + site.zoneName;
					if(site.regionName != null) {
						dzr = dzr + "-" + site.regionName;
					} else {
						dzr = dzr + "-";
					}
				} else {
					dzr = dzr + "-";
				}
			} else {
				dzr = "---";
			}
		} else if (site.type == "SiteDetails") {
			dzr = site.distZoneReg;
		}
		return dzr;
	};
	
	$scope.changeUserDetails = function(){
		var userInfo = contextStorage.getCurrentUserData();
		var UpdateUserDetailsCtrl = function ($scope, $modalInstance, modalService) {
			var buttons = [modalService.OK_BUTTON];
			$scope.i_fullName = userInfo.user.name;
			$scope.i_userName = userInfo.user.username;
			$scope.i_changePass = false;
			$scope.currentPassword = '';
			$scope.newPassword = '';
			$scope.reenterPassword = '';
			//alert(JSON.stringify(userInfo.user));
			$scope.changePassword = function(){
				if($scope.i_changePass==false){
					$scope.i_changePass = true;
					$('#changePwdDiv').show();
				}else{
					$scope.i_changePass = false;
					$('#changePwdDiv').hide();
				}
			};
			
			$scope.buttonCancel = function(){
				$modalInstance.close();
			};
			
			$scope.buttonSubmit = function(i_fullName,i_userName,i_changePass,currentPassword,newPassword,reenterPassword){
				var fullNameChanged = false;
				if($.trim(i_fullName)!=userInfo.user.name){
					var data = {};
					data.oldName = userInfo.user.name;
					data.newName = i_fullName;
					restService.postRestData('user/current/name', data, function(result) {
						fullNameChanged = true;
						changePass(i_changePass,currentPassword,newPassword,reenterPassword,fullNameChanged);
					},'acknowledge-all');
				}else {
					changePass(i_changePass,currentPassword,newPassword,reenterPassword,fullNameChanged);
				} 
			};
			
			var changePass = function(i_changePass,currentPassword,newPassword,reenterPassword,fullNameChanged){
				var passwordChanged = false;
				if(i_changePass==true){
					if($.trim(currentPassword)==''){
						var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.changeUserInfo'),jQuery.i18n.prop('i18nText.enterCurrentPassword'),buttons);
						modal.result.then(function(){
							$("#currentPassword").focus();
						});
					}else if($.trim(newPassword)==''){
						var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.changeUserInfo'),jQuery.i18n.prop('i18nText.enterNewPassword'),buttons);
						modal.result.then(function(){
							$("#newPassword").focus();
						});
					}else if($.trim(reenterPassword)==''){
						var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.changeUserInfo'),jQuery.i18n.prop('i18nText.enterReenterNewPassword'),buttons);
						modal.result.then(function(){
							$("#reenterPassword").focus();
						});
					}else{
						var data = {};
						data.oldPassword = currentPassword;
						data.password = newPassword;
						data.verifyPassword = reenterPassword;
						restService.postRestData('user/password', data, function(result) {
							passwordChanged = true;
							if(fullNameChanged || passwordChanged){
								var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.changeUserInfo'),jQuery.i18n.prop('i18nText.successUserInfoChanges'),buttons);
								modal.result.then(function(){
									window.location.reload();
								});
							}else{
								$modalInstance.close();
							}
						},'acknowledge-all');
					}
				}else{
					if(fullNameChanged || passwordChanged){
						var modal = modalService.openSimpleModal(jQuery.i18n.prop('i18nText.changeUserInfo'),jQuery.i18n.prop('i18nText.successUserInfoChanges'),buttons);
						modal.result.then(function(){
							window.location.reload();
						});
					}else{
						$modalInstance.close();
					}
				}
			};
		};
		return $modal.open({
			templateUrl: contextPath +'/ui/template/changeUserInfo.tpl',
			controller: UpdateUserDetailsCtrl,
			size: 'lg'
		});
	};
});


///////////////////////////////////////////////////////////////////
commonModule.directive('gotoSite', function($log, $timeout) {
	var logger = $log.getLogger("gotoSite", false);
	logger.info("inside directive");
	return {
	    restrict : "AE",
	    require : 'ngModel',
	    link : function($scope, elm, attr, ngModel) {
		    elm.on('blur keyup change', function(event) {
			    $scope.$apply(function() {
				    ngModel.$setViewValue(elm.val());
				    $scope.onKeyPress(elm, event);
			    });
		    });
	    },
	    controller : function($scope, $log, showSiteDetails, restService, contextStorage, utilityService) {
		    $scope.isDisabled = true;
		    $scope.sites = {};
		    $scope.siteNumber = [];
		    $scope.whichWindow;

		    $scope.load = function(whichWindow) {
			    $scope.whichWindow = "" + whichWindow;

			    logger.info("inside load");
			    var currentClient = contextStorage.getCurrentClient();
			    if (currentClient) {
				    $scope.sites = contextStorage.getCurrentSiteList();
				    if ($scope.sites == null) {
					    restService.getRestData(currentClient.sites.resourceLocation, function(sites) {
						    contextStorage.setCurrentSiteList(sites);
						    $scope.sites = sites;
						    $scope.fillSiteNumbers(sites);
					    }, function(emsg,ecode){
					    	utilityService.showMessage('warning', emsg, ecode, [404]);
					    });
				    } else {
					    $scope.fillSiteNumbers($scope.sites);
				    }
			    }
		    };

		    $scope.fillSiteNumbers = function(sites) {
			    angular.forEach($scope.sites, function(site) {
				    var siteNumber = "" + site.siteNumber;
				    $scope.siteNumber.push(siteNumber);
			    });
		    };

		    $scope.findSiteBySiteNumber = function(siteNumber) {
			    var siteObj;
			    angular.forEach($scope.sites, function(site) {
				    if (parseInt(site.siteNumber) == parseInt(siteNumber)) {
					    siteObj = site;
				    }
			    });

			    return siteObj;
		    };

		    $scope.goToSite = function(event) {
			    logger.debug("goToSite $scope.gotoSiteSearch = " + JSON.stringify($scope.gotoSiteSearch));
			    var modelValue = $scope.gotoSiteSearch;
			    modelValue = modelValue.trim();
			    var siteObj = $scope.findSiteBySiteNumber(modelValue);
			    showSiteDetails.go(siteObj, $scope.whichWindow);
			    $(event.currentTarget).parent().slideToggle(500);
			    $scope.gotoSiteSearch = "";
		    };

		    $scope.onKeyPress = function(elm, event) {
			    logger.debug(" $scope.siteNumber = " + JSON.stringify($scope.siteNumber));
			    elm.removeClass('site-not-exist');
			    elm.removeClass('site-exist');

			    var modelValue = $scope.gotoSiteSearch;
			    modelValue = modelValue.trim();

			    if (modelValue != "") {
				    if ($scope.siteNumber.indexOf(modelValue) != -1) {
					    elm.addClass('site-exist');
					    $scope.isDisabled = false;
					    if (event.which === 13) {
						    var siteObj = $scope.findSiteBySiteNumber(modelValue);
						    showSiteDetails.go(siteObj, $scope.whichWindow);
			   				$(event.currentTarget).parent().slideToggle(500);
			    			$scope.gotoSiteSearch = "";
					    }
				    } else {
					    elm.addClass('site-not-exist');
					    $scope.isDisabled = true;
				    }
			    }
		    };
	    }
	};
});

/** Enter site & go to site functionality **/
commonModule.factory('showSiteDetails', function($log) {
	var logger = $log.getLogger('showSiteDetails',false);	
	return {
		go : function(site, whichWindow) {
			logger.debug("site :- "+ JSON.stringify(site));
			
			var url = contextPath + "/ui/site/site-details.load?siteId="+site.siteId+"&clientId="+site.clientId;
			if (whichWindow == "same-window") {
				window.location.href = url;
			} else {
				var win = window.open(url, '_blank');
				win.focus();
			}
		}
	};
});

/** Symphony filter to remove whitespaces **/
commonModule.filter('nospaces', function() {
	return function(text) {
		return text.replace(/\s+/g, '');
	};
});

/** 
 * Symphony filter format percentages, given a number.
 * Number is assumed to be a decimal, ie 0.17 (which will produce "17%") 
 * **/
commonModule.filter('percentage', ['$filter', function ($filter) {
  return function (input) {
    return $filter('number')(input * 100, 0) + '%';
  };
}]);

/*
 * Intended for use as the attribute of an Input field
 * ex: <input type="text" portal-date-picker data-ng-model="model.someVariable" defaultdate="model.someDate" dateformat="YYYY-MM-DD" validate="false" required/>
 *
 *  If you have external controls (like a seperate button) modifying your model variable, you can bind the
 * updateDateSelection() function to the datepicker's ng-click directive to have the date selection updated when
 * the datepicker field is clicked
 *  Your model variable needs to be the property of an object.  It will not update as a primitive property of your scope.
 * 
 * Requires the following:
 * <link rel="stylesheet" href="<%= application.getContextPath() %>/static/css/datepicker/pikaday.css">
 * <script src="<%= application.getContextPath() %>/static/js/vendor/datepicker/moment.js"></script>
 * <script src="<%= application.getContextPath() %>/static/js/vendor/datepicker/pikaday.js"></script>
 */
commonModule.directive('portalDatePicker', function($log, $compile, $parse) {
	return {
		restrict : 'A',
		require : 'ngModel',
		scope: true,
		link: function(scope, element, attrs, ctrl) {
			var initializing = true;
			var dateFormat = attrs.dateformat ? attrs.dateformat : 'MM-DD-YYYY';
			var validate = attrs.validate ? attrs.validate : true;
			var minDate = new Date("01-01-2005");
			if (attrs.allowpast) {
				if (attrs.allowpast.toLowerCase() == "false") {
					minDate = new Date();   // nothing older than today
				}
			} 
			element = new Pikaday({
				field: element[0],
				format: dateFormat,
				yearRange: [2005, 2099],
				minDate: minDate,
				date: attrs.ngModel
			});
			scope.$watch(attrs.defaultdate, function(value) {
				var initDate = value;
				if (initializing && initDate) {
					element.setDate(initDate);
					initializing = false;
				}
			});
			scope.$watch(attrs.ngModel, function(value) {
				if (validate == true) {
					var theDate = moment(value, dateFormat, true);
					if (theDate.isValid()) {
						ctrl.$setValidity("date", true);
					} else if (value) {//Do not invalidate if null/undefined - allow input 'required' flag to validate that
						ctrl.$setValidity("date", false);
					} else {//input 'required' flag will still invalidate form if blank even after setting validity to true
						ctrl.$setValidity("date", true);
					}
				}
			});
			scope.updateDateSelection = function() {
				var ngModelFn = $parse(attrs.ngModel);
				var value = ngModelFn(scope);
				element.setDate(value); 
			}
		}
	};
});

/** 
 * ui-bootstrap has a directive called timepicker.  We named this 
 * directive jquerytimepicker to distinguish it from the ui-bootstrap version.

commonModule.directive('jquerytimepicker', function($log, $compile) {
	return {
	    restrict : 'AE', //attribute or element,
	    require : "ngModel",
	    link : function(scope, element, attrs, ctrl) {
		    /** http://xdsoft.net/jqplugins/datetimepicker/  **/
/*		    element.timepicker({
		    	datepicker: false,
		        //format : 'H:i',
		    	//12 hr format to display
		    	format: 'h:i A',
		    	step: 5,
		        onChangeDateTime : function(dp, $input) { 
		            
		            // This code is may required in future, Right now the value of the component is set by using fieldValidator directive using below likes mentione there
		            // elm.on('blur keyup change', function() { scope.$apply(function() { ngModel.$setViewValue(elm.val()); }); });
		            
			        scope.$apply(function() {
				        ctrl.$setViewValue($input.val());
			        });
			        
		        }
		    });
	    }
	};
});
 */

/** Symphony navigation menu selection **/
commonModule.directive('navigationSelection', function($log) {
	var logger = $log.getLogger("navigationSelection", false);
	logger.debug("Inside directive");

	return {
	    restrict : "AE",
	    controller : function($scope, $log, $location) {
		    $scope.routeIs = function(routeName) {
			    return $location.path() === routeName;
		    };
	    }
	};
});

/** common search filter & common data placeholder **/ 
commonModule.factory('searchFilter', function() {
	return {
		searchText : '',
		limit : null
	};
});

commonModule.factory('popupwindow', function($window) {
	return {
		show: function (url, title, w, h) {
			
			var wLeft = $window.screenLeft ? $window.screenLeft : $window.screenX;
		    var wTop = $window.screenTop ? $window.screenTop : $window.screenY;

		    var left = wLeft + ($window.innerWidth / 2) - (w / 2);
		    var top = wTop + ($window.innerHeight / 2) - (h / 2);
		    var win = $window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=1, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		    
		    win.focus();
		    return win;
        }
    };
});

commonModule.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {
	  var $transition = function(element, trigger, options) {
	    options = options || {};
	    var deferred = $q.defer();
	    var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];
	    var transitionEndHandler = function(event) {
	      $rootScope.$apply(function() {
	        element.unbind(endEventName, transitionEndHandler);
	        deferred.resolve(element);
	      });
	    };

	    if (endEventName) {
	      element.bind(endEventName, transitionEndHandler);
	    }
	    $timeout(function() {
	      if ( angular.isString(trigger) ) {
	        element.addClass(trigger);
	      } else if ( angular.isFunction(trigger) ) {
	        trigger(element);
	      } else if ( angular.isObject(trigger) ) {
	        element.css(trigger);
	      }
	      if ( !endEventName ) {
	        deferred.resolve(element);
	      }
	    });

	    deferred.promise.cancel = function() {
	      if ( endEventName ) {
	        element.unbind(endEventName, transitionEndHandler);
	      }
	      deferred.reject('Transition cancelled');
	    };
	    return deferred.promise;
	  };

	  var transElement = document.createElement('trans');
	  var transitionEndEventNames = {
	    'WebkitTransition': 'webkitTransitionEnd',
	    'MozTransition': 'transitionend',
	    'OTransition': 'oTransitionEnd',
	    'transition': 'transitionend'
	  };
	  var animationEndEventNames = {
	    'WebkitTransition': 'webkitAnimationEnd',
	    'MozTransition': 'animationend',
	    'OTransition': 'oAnimationEnd',
	    'transition': 'animationend'
	  };
	  function findEndEventName(endEventNames) {
	    for (var name in endEventNames){
	      if (transElement.style[name] !== undefined) {
	        return endEventNames[name];
	      }
	    }
	  }
	  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
	  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
	  return $transition;
	}]);

commonModule.directive("collapsibleHeader", function($compile,$transition,$timeout) {
	return {
	    restrict : 'C',
	    replace : true,
	    scope : true,
	    link : function($scope, element, attributes) {
	        var initialAnimSkip = true;
	        var currentTransition;
	    	var targetElement = element.next();
	        
	    	function doTransition(change){
	            var newTransition = $transition(targetElement, change);
	            if (currentTransition) {
	              currentTransition.cancel();
	            }
	            currentTransition = newTransition;
	            newTransition.then(newTransitionDone, newTransitionDone);
	            return newTransition;

	            function newTransitionDone() {
	              if (currentTransition === newTransition) {
	                currentTransition = undefined;
	              }
	            }
	          }
	        
	        function expand() {
              targetElement.removeClass('collapsible-body').addClass('collapsing');
              doTransition({ height: targetElement[0].scrollHeight + 'px' }).then(expandDone);
            }

	          function expandDone() {
	        	targetElement.removeClass('collapsing');
	        	targetElement.addClass('collapsible-body collapsible-active');
	        	targetElement.css({height: 'auto'});
	          }

	          function collapse() {
	              targetElement.css({ height: targetElement[0].scrollHeight + 'px' });
	              var x = targetElement.offsetWidth;
	              targetElement.removeClass('collapsible-body collapsible-active').addClass('collapsing');
	              doTransition({ height: 0 }).then(collapseDone);
	          }

	          function collapseDone() {
	        	targetElement.removeClass('collapsing');
	        	targetElement.addClass('collapsible-body');
	          }
	    	
		    if (element.parent().hasClass("enable")) {

			    var htmlPlus = "<span class='collapsible-plus'> + </span>";
			    var htmlMinus = "<span class='collapsible-minus'> - </span>";

			    if (element.next().hasClass("collapsible-body collapsible-active")) {
				    element.prepend(htmlMinus);
			    } else {
				    element.prepend(htmlPlus);
			    }
			    var animate = attributes.animate;
			    element.bind('click', function() {
				    if (element.next().hasClass("collapsible-body collapsible-active")) {
				    	if(animate){
				    		collapse();
				    	}else{
						    element.next().hide();
						    element.next().removeClass("collapsible-active");
				    	}
					    element.children('span.collapsible-minus').remove();
					    element.prepend(htmlPlus);
				    } else {
				    	if(animate){
				    		expand(element.next());
				    	}else{
						    element.next().show();
						    element.next().addClass("collapsible-active");
				    	}
					    element.children('span.collapsible-plus').remove();
					    element.prepend(htmlMinus);
				    }
			    });

			    $compile(element.contents())($scope);
		    }
	    }
	};
});

commonModule.directive('siteNote', function($rest, restService, utilityService) {
	return {
		restrict: 'AE',
		templateUrl: contextPath+'/ui/template/siteNote.tpl',
		replace : true,
	    scope : {
	    	site : "=",
	    	deviceKey : '@',    	
	    },
		link: function(scope, elem, attrs){
			
	    	scope.$watch('deviceKey', function(newValue, oldValue) {
			    if (newValue !== oldValue) {
			    	scope.showNotes(newValue);
			    }
		    }, true);
			
	    	scope.showNotes = function(deviceKey){
	    		 if (deviceKey != null) {
				    var url = scope.site.resourceLocation + $rest.notes + "/" + deviceKey;
				    restService.getRestData(url, function(note) {
					    scope.note = note;
				    }, function(emsg, ecode) {
					    scope.note = {};
					    utilityService.showMessage('warning', emsg, ecode, [ 404 ]);
				    });
			    }
	    	};
	    	
	    	scope.showNotes(attrs.deviceKey);
	    	
			/** To save a new note **/
			scope.addNewNote = function(noteToAdd) {
				var url = scope.site.resourceLocation + $rest.notes+"/" + attrs.deviceKey;
				restService.postRestDataAsJson(url,
					{
						type : "Note",
						siteid : scope.site.siteId,
						key : attrs.deviceKey,
						ts : null,
						text : noteToAdd,
						userName : null
					},
					function(successResponse) {
						scope.newNoteText = "";
						scope.showNotes(attrs.deviceKey);
					},'error-all');
			};
		}
	};
});

commonModule.directive('siteTimeClock', function($log, $rest, $interval) {
	return {
	    restrict : 'AE',
	    replace : true,
	    scope : {
		    site : '=site'
	    },
	    template : '<div class="sitetime" > <span> {{timeStamp}}&nbsp;{{timezoneDisplay}} </span> </div>',
	    link : function($scope, elem, attrs) {
	    	
	    	var clockInterval;
	    	clock();
	    	
		    function clock() {

			    var offset = $scope.site.timezoneOffset / (60 * 1000); // to minutes, b/c browser is in minutes
			    if (offset != null) {
				    var d = new Date();
				    offset = ((offset + d.getTimezoneOffset()) * (60 * 1000)); // back to millis
				    var sdate = new Date(d.getTime() + offset);

				    // dumb it down for Americans (TODO: fix for all locales...)
				    var ampm = " AM ";
				    var hrs = sdate.getHours();
				    if (hrs == 0) {
					    hrs = 12;
				    } else if (hrs >= 12) {
					    ampm = " PM ";
					    if (hrs > 12) {
						    hrs = hrs - 12;
					    }
				    }
				    // added to root scope so it can be used on all pages
				    if (sdate.getMinutes() < 10) {
					    $scope.timeStamp = hrs + ":0" + sdate.getMinutes() + ampm;
				    } else {
					    $scope.timeStamp = hrs + ":" + sdate.getMinutes() + ampm;
				    }
				    
				    // get timezone display.  
				    // This will switch America/Chicago to CST using i18n support
				    var timezoneDisplayKey = $scope.site.timezone.replace("/", ".")
				    $scope.timezoneDisplay = jQuery.i18n.prop("i18nText.timezone." + timezoneDisplayKey);
			    }
		    }
		    
		    clockInterval = $interval(function() {
			    clock(); // update DOM
		    }, 15000);

		    elem.on('$destroy', function() {
			    $interval.cancel(clockInterval);
		    });
	    }
	};
});

commonModule.directive('deviceExceptions', ['$log','$rest','utilityService','restService','contextStorage', 'popupwindow',function($log, $rest, utilityService, restService, contextStorage, popupwindow) {
	return {
	    restrict : 'AE',
	    replace : true,
	    scope : {
	    	site : "=",
		    deviceKey : '@',
	    },
	    templateUrl : contextPath +'/ui/template/deviceException.tpl',
	    link : function(scope, elem, attrs) {
	    	var logger = $log.getLogger('deviceExceptionsDirective', false);
	    	logger.debug(" In deviceExceptionsDirective " + JSON.stringify(scope.site));
	    	scope.exceptions = null;
	    	scope.exceptionError = null;
	    	var deviceExceptions = new Array();	    	
	    	var deviceKey = null;
	    	var exceptionInfo = contextStorage.getSiteExceptionsData();
	    	var exceptionData = null;
	    	if(exceptionInfo != null) {
	    		exceptionData = exceptionInfo.exceptions;
	    	}
	    	
	    	if (scope.deviceKey == undefined){
				/**Condition excuted when device-key is not included in the HTML tag like for site-general tab*/
	    		if(exceptionData == null){
	    			getExceptions().then(function(response) {
	    					scope.exceptions = response;
	    			}, function(error) {
	    				utilityService.showMessage('error',error.emsg,error.ecode,[404]);
	    				scope.exceptionError = {
	    				    success : false,
	    				    message : jQuery.i18n.prop('err.msg.exceptions.notFound'),
	    				};
	    			});
	    		}else {
	    			scope.exceptions = exceptionData;
	    		}
	    		
	    	}else{
		    	scope.$watch('deviceKey', function(newValue, oldValue) {		    		 			
	    			if (newValue != oldValue) {
	    				/**Condition executed when other device is selected*/
				    	logger.debug("newValue != oldValue -------> scope.deviceKey " + scope.deviceKey);	
				    	if (scope.deviceKey != null && scope.deviceKey != "") {
				    		scope.exceptionError == null;
			    			loadExceptions();
			    		}
			    		else{
			    			scope.exceptionError = {
			    				    success : false,
			    				    message : jQuery.i18n.prop('err.msg.device.notSelected'),
			    				};
			    		}    
				    }else{
				    	if(oldValue == "" || oldValue == null){
			    			/**Condition excuted when there is error in retrieving the devices for particular site 
			    			 * eg. For Controls tab when xml file is not found
			    			 */
				    		logger.debug("oldValue == null ------> scope.deviceKey " + scope.deviceKey);	
			    			scope.exceptionError = {
			    				    success : false,
			    				    message : jQuery.i18n.prop('err.msg.device.notFound'),
			    				};			
			    			};				    	
				    };  				    
		    }, true); 
	    };	    	
	    	
	    	/**To load exceptions for particular Device*/
	    	function loadExceptions(){
	    		scope.exceptions = null;
		    	scope.exceptionError = null;
		    	exceptionInfo = contextStorage.getSiteExceptionsData();
		    	if(exceptionInfo != null) {
		    		exceptionData = exceptionInfo.exceptions;
		    	}
		    	
	    		deviceKey = scope.deviceKey;
	    		logger.debug("deviceKey " + deviceKey);
	    		if (deviceExceptions[deviceKey] == undefined) {
	    			if(exceptionData == null){
	    				getExceptions().then(function(response) {
		    				if (response.length != 0) {
		    					scope.exceptions = response;
		    				} else {
		    					scope.exceptionError = {
		    					    success : false,
		    					    message : deviceKey + ": " + jQuery.i18n.prop('err.msg.exceptions.notFound'),
		    					};
		    				}
		    			}, function(error) {
		    				utilityService.showMessage('error',error.emsg,error.ecode,[404]);
		    				scope.exceptionError = {
		    				    success : false,
		    				    message : deviceKey + ": " + jQuery.i18n.prop('err.msg.exceptions.notFound'),
		    				};
		    			});
	    			}else{
	    				var deviceException = getDeviceExceptionList(exceptionData);
	    				if (deviceException.length != 0) {
	    					scope.exceptions = deviceException;
	    				} else {
	    					//scope.exceptions = [];
	    					scope.exceptionError = {
	    					    success : false,
	    					    message : deviceKey + ": " + jQuery.i18n.prop('err.msg.exceptions.notFound'),
	    					};
	    				}
	    			}
	    		} else {
	    			logger.debug("deviceExceptions[deviceKey] " + JSON.stringify(deviceExceptions[deviceKey]));
	    			if (deviceExceptions[deviceKey].length == 0) {
	    				//scope.exceptions = [];
	    				scope.exceptionError = {
	    				    success : false,
	    				    message : deviceKey + ": " + jQuery.i18n.prop('err.msg.exceptions.notFound'),
	    				};
	    			} else {
	    				scope.exceptions = deviceExceptions[deviceKey];
	    			};
	    		};
	    	};
	    	
	    	function getExceptions() {
			    //var url = scope.site.resourceLocation + $rest.exceptions + '?start=08-17-2012&end=01-01-2013';	    		
    			var url = scope.site.resourceLocation + $rest.exceptions + '?prevdays='+attrs.previousDays;
			    return restService.getRestData(url, function(exceptionResponse) {
			    	//alert('api call');
			    	contextStorage.setSiteExceptionsData(exceptionResponse.exceptions);
			    	return getDeviceExceptionList(exceptionResponse.exceptions);				    	
			    },function(emsg, ecode) {
			    	//Not handing error here, errors will the handled in the caller, send error message and error code back to caller
				    throw {
				        success: false,
				        emsg: emsg,
				        ecode: ecode
				    };
			    });   
		    };
		    
		    function getDeviceExceptionList(exceptionData){
		    	if(deviceKey == null){
		    		/**Condition executed when device-key is undefined*/
		    		return exceptionData;
		    	};
		    	deviceExceptions[deviceKey] = [];
			    for (var i = 0; i < exceptionData.length; i++) {
				    if (exceptionData[i].sensorKey == deviceKey) {
					    //logger.debug("exceptionData[i].deviceKey " + exceptionData[i].deviceKey);
					    deviceExceptions[deviceKey].push(exceptionData[i]);
				    };
			    }
			    logger.debug("deviceExceptions[deviceKey] " + JSON.stringify(deviceExceptions[deviceKey]));
			    return deviceExceptions[deviceKey];		    	
		    };
		    
		  scope.openExceptionViewer = function(exception) {
			  logger.debug("openExceptionViewer:  exceptionId = " + exception.eventId)
			  if (exception != null) {
					var exceptionURL = contextPath + "/ui/site/editors/site-exception-viewer.load?siteId="
						+scope.site.siteId+"&clientId="+scope.site.clientId +
						"&exceptionId=" + exception.eventId;
					popupwindow.show(exceptionURL, "SiteExceptionViewer" + exception.eventId, "800", "550");
			  }
		  };
	    }
	};
}]);

/**To define constant throughout the app*/
commonModule.factory('$constants', function() {	
	
	   return {
		   overrideDeviceStrategyMins : [ {
				key : jQuery.i18n.prop("i18n.text.min5"),
		        value : 5 * 60
		    /** This is seconds value **/
		    }, {
		        key : jQuery.i18n.prop("i18n.text.min30"),
		        value : 30 * 60
		    }, {
		       	key : jQuery.i18n.prop("i18n.text.hr1"),
		        value : 1 * 60 * 60
		    },  {
		        key : jQuery.i18n.prop("i18n.text.hr4"),
		        value : 4 * 60 * 60
		    },  {
		        key : jQuery.i18n.prop("i18n.text.hr8"),
		        value : 8 * 60 * 60
		    },  {
		        key : jQuery.i18n.prop("i18n.text.hr12"),
		        value : 12 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.day1"),
		        value : 1 * 24 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.week1"),
		        value : 7 * 24 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.month1"),
		        value : 31 * 24 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.month3"),
		        value : 31 * 3 * 24 * 60 * 60
		    } ],
		    
		    overrideGroupStrategyMins : [ {
				key : jQuery.i18n.prop("i18n.text.min5"),
		        value : 5 * 60
		    /** This is seconds value **/
		    }, {
		        key : jQuery.i18n.prop("i18n.text.min30"),
		        value : 30 * 60
		    }, {
		       	key : jQuery.i18n.prop("i18n.text.hr1"),
		        value : 1 * 60 * 60
		    },  {
		        key : jQuery.i18n.prop("i18n.text.hr4"),
		        value : 4 * 60 * 60
		    },  {
		        key : jQuery.i18n.prop("i18n.text.hr8"),
		        value : 8 * 60 * 60
		    },  {
		        key : jQuery.i18n.prop("i18n.text.hr12"),
		        value : 12 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.day1"),
		        value : 1 * 24 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.week1"),
		        value : 7 * 24 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.month1"),
		        value : 31 * 24 * 60 * 60
		    },{
		        key : jQuery.i18n.prop("i18n.text.month3"),
		        value : 31 * 3 * 24 * 60 * 60
		    } ],

		    getOverrideStrategies : function(screamValue){
				 if(screamValue == "Scream40"){
					return [ {
				        key : jQuery.i18n.prop("i18n.text.occupied"),
				        value :"Occupied"
				    }, {
				        key : jQuery.i18n.prop("i18n.text.setback"),
				        value : "Setback"
				    }, {
				        key : jQuery.i18n.prop("i18n.text.off"),
				        value : "OFF"
				    }];
				}				 
				else {
					return [ {
				        key : jQuery.i18n.prop("i18n.text.occupied"),
				        value :"Occupied"
				    }, {
				        key : jQuery.i18n.prop("i18n.text.setback"),
				        value : "Setback"
				    }, {
				        key : jQuery.i18n.prop("i18n.text.on"),
				        value : "ON"
				    }, {
				        key : jQuery.i18n.prop("i18n.text.off"),
				        value : "OFF"
				    }];
				}
			},
	   
	   getRange : function(lowerValue,upperValue){
			    var overrideSetpoint = [];
			  
			   	//Generate the key-value pair for required range
			   for(var i = lowerValue; i <= upperValue; i++){
				   var keyString = i.toString();
				   if(i >= 0){
					   keyString = " "+keyString;
				   }
				   var temp = {
						   		key : keyString,
						   		value :i
				   			};
				   overrideSetpoint.push(temp);
			   };
				 
			   return overrideSetpoint;
			}
	   	};
	});

commonModule.factory('converter', function() {

	var converter = {};

		/*To convert 24hr format to 12hr format*/
	converter.convertTimeTo12hrFormat = function(time){
		var timeIn12hr = "12:00AM";
		if(time != null && time != ""){
			var hr = parseInt(time.split(':')[0],10);
			var min =  time.split(':')[1];			
			var ampm = "AM";
		    if (hr == 0) {
			    hr = 12;
		    } else if (hr >= 12) {
			    ampm = "PM";
			    if (hr > 12) {
				    hr = hr - 12;
			    }
		    }
		    if (hr < 10){
		    	hr = '0'+hr;
		    }
		    timeIn12hr = hr + ':' + min + ampm;
		}
		return timeIn12hr;
	};
	
	/* Convert 12 hour format time (with AM/PM) to 24 hour format */
    converter.convertTimeto24HrFormat = function(time){
		
		var timeIn24hr = "";
		
		if(time != null && time != ""){
		
			var timeArray = time.split(":"); //09:00am or 09:00pm
			var hours = timeArray[0];
			var mins = "00";  
			var value = timeArray[1];
			value = value.toUpperCase();
			
			//if am
			if (value.indexOf("AM") > -1)
			{
				mins = value.substring(0, value.indexOf("AM"));
				if (hours == 12)
				{
					hours = "00";
				}
				
				timeIn24hr = hours;
			}
			//if pm
			else if (value.indexOf("PM") > -1)
			{
				mins = value.substring(0, value.indexOf("PM"));
				if (hours < 12)
				{
					timeIn24hr = parseInt(hours) + 12;
				} else if (hours == 12) {
					timeIn24hr = hours;
				}
			}
			
			timeIn24hr = timeIn24hr + ":" + mins;
		}
		return timeIn24hr;
	};
	
	return converter;

});

commonModule.factory('iconIndexMapping',function(){
	return{
		
		/*To get map icon path as per kpi index for HVAC and Circuits tab*/
		getStatusIconPath : function(index){
			var iconPath = contextPath+'/static/images/1pxblank.png';
			var statusIconMap = [contextPath+'/static/images/excep1.png'       		//0
				                  ,contextPath+'/static/images/excep2.png'       	//1
				                  ,contextPath+'/static/images/excep3.png'          //2
				                  ,contextPath+'/static/images/excep4.png'];  		//3
			
			if(index >= 0 || index <= 3){
				iconPath = statusIconMap[index];
				}
			return iconPath;
		}
	};
});