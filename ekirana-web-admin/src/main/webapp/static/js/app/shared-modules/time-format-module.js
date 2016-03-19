'use strict';

var timeFormatModule = angular.module('timeFormatModule', [ 'ng']);

timeFormatModule.directive('timeFormatter', function($parse) {
	return {
		restrict : 'A',
		scope: true,
		require: "ngModel",
		link: function(scope, element, attrs, ngModel) {
			var ngModelFn = $parse(attrs.ngModel);
			var validateFn = $parse(attrs.validate);
			var validate = validateFn(scope);
			var emptyFn = $parse(attrs.empty);   // can user leave a field empty?  used for multisite
			var empty = emptyFn(scope);
			
			//function to select all text in input field
			//assign to data-ng-click if desired...
			scope.selectAll = function () {
				element.select();
			}
			
			//Trigger the time formatter if enter key is pressed
			element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.formatTime();
	                });
	                event.preventDefault();
	            }
	        });
			
			//format input string into 24hr time format.
			//bind to data-ng-blur if desired...
			scope.formatTime = function () {
				var value = ngModelFn(scope);
				if (value) {
					value = value.replace(/\s/g, '');
					value = value.replace('m', '');
					value = value.replace('M', '');
					value = value.replace(':', '');
					if (value.length > 0) {
						if (value.indexOf('p') > -1 ||
								value.indexOf('P') > -1) {
							value = value.replace('p', '');
							value = value.replace('P', '');
							if (!isNaN(value)) {
								if (parseInt(value) < 12) {
									value = parseInt(value) + 12;
									value += "00";
								} else if (value.length == 3) {
									var hours = parseInt(value.substring(0,1));
									hours += 12;
									value = hours + value.substring(1,3);
								} else if (value.length == 4) {
									var hours = value.substring(0,2);
									hours = (parseInt(hours) < 12) ? parseInt(hours) + 12 : hours;
									value = hours + value.substring(2,4);
								} else if (value == "12") {
									value += "00";
								}
							}
						} else {
							var amSpecified = false;
							if (value.indexOf('a') > -1 ||
									value.indexOf('A') > -1) {
								value = value.replace('a', '');
								value = value.replace('A', '');
								amSpecified = true;
							}
							if (!isNaN(value)) {
								if (value.length == 1 || value.length == 3) {
									value = "0" + value;
								} else if (value.length >= 2 && value.substring(0,2) == "12" && amSpecified) {
									value = "00" + value.substring(2,value.length);
								}
								for (i = value.length; i < 4; i++) {
									value += "0";
								}
							}
						}
						if (!isNaN(value) && value.length == 4) {
							value = value.substring(0,2) + ":" + value.substring(2,4);
							ngModel.$setViewValue(value);
							ngModel.$render();
						}
					}
				}
				setValidity();
			}
			
			var setValidity = function() {
				if (validate) {
					var value = ngModelFn(scope);
					if (value.length > 0) {
						if (/^(([0-1]\d|[2][0-3]):[0-5]\d)|(24:00)$/.test(value)) {
							ngModel.$setValidity("time", true);
						} else {
							ngModel.$setValidity("time", false);
						}
					} else if ((value.length == 0) && empty) {   // if empty is ok...
						ngModel.$setValidity("time", true);
					} else {
						ngModel.$setValidity("time", false);
					}
				}
			}
			
			setValidity();
		}
	};
});
