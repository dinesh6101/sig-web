'use strict';

var collapsibleModule = angular.module('collapsibleModule', [ 'ng']);

collapsibleModule.directive('collapsibleSection', function() {
	return {
		restrict: 'E',
		scope : true,
		link: function(scope, element, attrs, ctrl) {
			var state = ($(element).next('.available_info').hasClass('hide')) ? 0 : 1;
			scope.toggle = function(e) {
				if(state == 0) {
					$(e.currentTarget).removeClass('icon-triangle-bottom').addClass('icon-triangle-top').parent().next('.available_info').slideDown(500);
					state = 1;	
				}
				else if (state == 1) {
					$(e.currentTarget).removeClass('icon-triangle-top').addClass('icon-triangle-bottom').parent().next('.available_info').slideUp(500);
					state = 0;
				}
			};
		},
		template: function(tElement, tAttrs) {
			if ($(tElement).next('.available_info').hasClass('hide')) {
				return '<h4 class="expand_btn icon-triangle-bottom" data-ng-click="toggle($event)">'+tAttrs.title+'<span class="sprite"></span></h4>';
			} else {
				return '<h4 class="expand_btn icon-triangle-top" data-ng-click="toggle($event)">'+tAttrs.title+'<span class="sprite"></span></h4>';
			}
		}
		
	};
});
