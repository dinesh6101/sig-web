var grosaryMenu = angular.module('grosaryMenu', [ 'ngRoute', 'restModule',
		'modalModule', 'utilModule', 'storageModule', 'commonModule' ]);

grosaryMenu.controller('grosaryMenuController', function($timeout, $scope, $log,
		$location, $rest, restService, utilityService) {
	
	$scope.menu =  function(){
		var menu_ul = $('.menu > li > ul'),
        menu_a  = $('.menu > li > a');
		  menu_ul.hide();
		  menu_a.click(function(e) {
		      e.preventDefault();
		      if(!$(this).hasClass('active')) {
		          menu_a.removeClass('active');
		          menu_ul.filter(':visible').slideUp('normal');
		          $(this).addClass('active').next().stop(true,true).slideDown('normal');
		      } else {
		          $(this).removeClass('active');
		          $(this).next().stop(true,true).slideUp('normal');
		      }
		  });
	};
	
	$timeout(function () { // You might need this timeout to be sure its run after DOM render.
        $scope.menu();
    }, 1000, false);
	
	var logger = $log.getLogger("grosaryMenuController", true);

	$scope.isShowZoomDiv = false;
	$scope.isShowMainDiv = true;
	$scope.countOfClick = 0;
	$scope.groceryCategory = {
		grocerycategoryname : ""
	};
	$scope.itemCategory = {
		itemcategoryname : ""
	};
	$scope.dataGroceryDropDown = {
		repeatSelectGrocery : null,
		availableOptions : [],
	};

	$scope.dataItemCatDropDown = {
		repeatSelectItem : null,
		availableOptions : [],
	};
	$scope.item = {
		repeatSelectItem : null,
		availableOptions : [],
	};
	$scope.itemCount = {
			repeatSelectItemCount : null,
			availableOptions : [],
	};
	
	restService.getRestData("itemCount", function(resultPromise) {
		var message = resultPromise;
		utilityService.showMessage('info', message, null, null);
		$scope.itemCount.availableOptions = resultPromise;
	}, 'warning-all');
	
	restService.getRestData("groceryCategory", function(resultPromise) {
		var message = resultPromise;
		utilityService.showMessage('info', message, null, null);
		$scope.dataGroceryDropDown.availableOptions = resultPromise;
	}, 'warning-all');

	restService.getRestData("itemCategory", function(resultPromise) {
		var message = resultPromise;
		utilityService.showMessage('info', message, null, null);
		$scope.dataItemCatDropDown.availableOptions = resultPromise;
	}, 'warning-all');


	restService.getRestData("items", function(resultPromise) {
		var message = resultPromise;
		utilityService.showMessage('info', message, null, null);
		$scope.item.availableOptions = resultPromise;
	}, 'warning-all');
	
	
	$scope.showMainDiv = function() {
		
		if ($scope.isShowZoomDiv == false) {
			$scope.isShowZoomDiv = true;
			$scope.isShowMainDiv = false;
		} else {
			$scope.isShowZoomDiv = false;
			$scope.isShowMainDiv = true;
		}
	};

	$scope.itemsWithImageList = {
			repeatSelectItems : null,
			availableOptions : [],
		};
	
	restService.getRestData("itemsWithImagePath",function(resultPromise) {
		  var message = resultPromise ;
		  utilityService.showMessage('success', message, null,null);
		  $scope.itemsWithImageList.availableOptions = resultPromise;
		  if(grocerycategoryid != undefined && itemcategoryid != undefined )
		    {
				filterItem(itemcategoryid,grocerycategoryid);
			}
		 }, 'warning-all');

	
	    var cnt = 1;
		var orgCollection; 
		filterItem = function(itemcategoryid,grocerycategoryid) {
			if(cnt == 1)
	        {
			    orgCollection = $scope.itemsWithImageList.availableOptions;
	    	}
		        cnt++;
		        var arr = [];
			    for(var x in orgCollection)
			    {
				    if(orgCollection[x].grocerycategoryid == grocerycategoryid && orgCollection[x].itemcategoryid == itemcategoryid )
				    {
					   arr.push(orgCollection[x]);
				    }
			     }
			 
			    $scope.itemsWithImageList.availableOptions = arr;
			
		};
		
		var newStringGrocery ;
		var newStringitemcategory;
		$scope.removespaceGrocery = function(grocerycategoryname) {
			str=grocerycategoryname;
			newStringGrocery = str.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
			return "grocery/" + newStringGrocery;
		}
	 
		$scope.removespaceItemCategory = function(itemcategoryname) {
			str=itemcategoryname;
			newStringitemcategory = str.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
			return "grocery/" + newStringGrocery + "/" + newStringitemcategory;
		}
});