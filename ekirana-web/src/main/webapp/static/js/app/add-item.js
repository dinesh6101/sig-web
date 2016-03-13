/**
 * 
 */

var addItem = angular.module('addItem', [ 'ngRoute', 'restModule',
		'modalModule', 'utilModule', 'storageModule', 'commonModule' ]);

addItem.controller('addItemController',function($scope, $log, $location, $rest, restService,
						utilityService, fileUpload) {
					var logger = $log.getLogger("addItemController", true);
					
					
					
					$scope.groceryCategory = {
						grocerycategoryname : ""
					};

					$scope.itemCategory = {
						itemcategoryname : ""
					};

					$scope.itemType = {
							itemtypename : ""
					};
					
					$scope.brand = {
						brandname : ""
					};

					/*$scope.unitCategory = {
						unit : ""
					};*/

					$scope.item = {
						grocerycategoryid : "",
						itemcategoryid : "",
						itemtypeid:"",
						itemname : "",
						unit : "",
						itemdescription : "",
						cost : "",
						imageid : ""
					};

					$scope.dataGroceryDropDown = {
						repeatSelectGrocery : null,
						availableOptions : [],
					};

					$scope.dataItemCatDropDown = {
						repeatSelectItem : null,
						availableOptions : [],
					};
					
					$scope.dataItemTypeDropDown = {
							repeatSelectItemType : null,
							availableOptions : [],
						};

					$scope.dataBrandDropDown = {
						repeatSelectBrand : null,
						availableOptions : [],
					};

					$scope.dataUnitDropDown = {
						repeatSelectUnit : null,
						availableOptions : [],
					};

					$scope.items = {
							repeatSelectItems : null,
							availableOptions : [],
						};
					$scope.itemsWithImageList = {
							repeatSelectItems : null,
							availableOptions : [],
						};
					
					 
					$scope.isShowGroceryCategory = false;
					$scope.addGroceryCategoryButton = "Add";

					$scope.isShowItemCategory = false;
					$scope.addItemCategoryButton = "Add";
					
					$scope.isShowItemType = false;
					$scope.addItemTypeButton = "Add";

					$scope.isShowBrand = false;
					$scope.addBrandButton = "Add";

					$scope.isShowUnitCategory = false;
					$scope.addUnitCategoryButton = "Add";
					
					restService.getRestData("/items",function(resultPromise) {
										  var message = resultPromise ;
										  utilityService.showMessage('success', message, null,null);
										  $scope.items.availableOptions = resultPromise;
										 }, 'warning-all');
					
					restService.getRestData("/itemsWithImagePath",function(resultPromise) {
										  var message = resultPromise ;
										  utilityService.showMessage('success', message, null,null);
										  $scope.itemsWithImageList.availableOptions = resultPromise;
										 }, 'warning-all');
					
					restService.getRestData("/searchItem",function(resultPromise) {
						  var message = resultPromise ;
						  utilityService.showMessage('success', message, null,null);
						  $scope.items.availableOptions  = resultPromise;
						 }, 'warning-all');
					
					
					
					/*app.filter('name', function(){
					    return function(arr, searchItem){
					        if(!searchItem){
					            return arr;
					        }
					        var result = [];
					        searchItem = searchItem.toLowerCase();
					        angular.forEach(arr, function(item){
					            if(item.title.toLowerCase().indexOf(searchItem) !== -1){
					            result.push(item);
					        }
					        });
					        return result;
					    };
					});*/
					

					var groceryCategory = function() {
						restService.getRestData("groceryCategory",function(resultPromise) {
											var message = "groceryCategory success";
											utilityService.showMessage('success', message, null,null);
											$scope.dataGroceryDropDown.availableOptions = resultPromise;
										}, 'warning-all');
					};

					var itemCategory = function() {
						restService.getRestData("itemCategory",function(resultPromise) {
											var message = "itemCategory success";
											utilityService.showMessage('success', message, null,null);		 
											$scope.dataItemCatDropDown.availableOptions = resultPromise;															                 
										}, 'warning-all');
					};
					
					var itemType = function() {
						restService.getRestData("itemType",function(resultPromise) {
											var message = "itemType success";
											utilityService.showMessage('success', message, null,null);		 
											$scope.dataItemTypeDropDown.availableOptions = resultPromise;															                 
										}, 'warning-all');
					};

					var brand = function() {
						restService.getRestData("brand",function(resultPromise) {
											var message = "brand success";
											utilityService.showMessage('success', message, null,null);
											$scope.dataBrandDropDown.availableOptions = resultPromise;
										}, 'warning-all');
					};

					var distinctUnit = function() {
						restService.getRestData("distinctUnit",function(resultPromise) {
											var message = "distinctUnit success";
											utilityService.showMessage('success', message, null,null);
											$scope.dataUnitDropDown.availableOptions = resultPromise;
										}, 'warning-all');
					};

					groceryCategory();
					itemCategory();
					itemType();
					brand();
					distinctUnit();

					$scope.showAddGroceryCategory = function() {
						if ($scope.isShowGroceryCategory == false) {
							$scope.addGroceryCategoryButton = "Hide";
							$scope.isShowGroceryCategory = true;
						} else {
							$scope.isShowGroceryCategory = false;
							$scope.addGroceryCategoryButton = "Add";
						}
					};

					$scope.showAddItemCategory = function() {
						if ($scope.isShowItemCategory == false) {
							$scope.addItemCategoryButton = "Hide";
							$scope.isShowItemCategory = true;
						} else {
							$scope.isShowItemCategory = false;
							$scope.addItemCategoryButton = "Add";
						}
					};
					$scope.showAddItemType = function() {
						if ($scope.isShowItemType == false) {
							$scope.addItemTypeButton = "Hide";
							$scope.isShowItemType = true;
						} else {
							$scope.isShowItemType = false;
							$scope.addItemTypeButton = "Add";
						}
					};
					
					$scope.showAddBrand = function() {
						if ($scope.isShowBrand == false) {
							$scope.addBrandButton = "Hide";
							$scope.isShowBrand = true;
						} else {
							$scope.isShowBrand = false;
							$scope.addBrandButton = "Add";
						}
					};

					
					$scope.addGroceryCategory = function() {
							var data = {
									grocerycategoryname : $scope.groceryCategory.grocerycategoryname
								};

						restService.postRestDataAsJson("groceryCategoryIgnoreDuplicate",data,function(resultPromise) {
											var message = "Data Saved ...";
											utilityService.showMessage('success', message, null,null);
											$scope.groceryCategory.grocerycategoryname = "";
											$scope.showAddGroceryCategory();
										}, 'error-all');
					};

					$scope.addItemCategory = function() {
								var data = {
										grocerycategoryid : $scope.dataGroceryDropDown.repeatSelectGrocery,
										itemcategoryname : $scope.itemCategory.itemcategoryname
								};

						restService.postRestDataAsJson("itemCategoryIgnoreDuplicate", data, function(resultPromise) {
											var message = "Data Saved ...";
											utilityService.showMessage('success',message, null, null);
											$scope.itemCategory.itemcategoryname = "";
											$scope.showAddItemCategory();
										}, 'error-all');
					};
					
					$scope.addItemType = function() {
						var data = {
								grocerycategoryid : $scope.dataGroceryDropDown.repeatSelectGrocery,
								itemcategoryid : $scope.dataItemCatDropDown.repeatSelectItem,
								itemtypename : $scope.itemType.itemtypename
						};

				restService.postRestDataAsJson("itemType", data, function(resultPromise) {
									var message = "Data Saved ...";
									utilityService.showMessage('success',message, null, null);
									$scope.itemType.itemtypename = "";
									$scope.showAddItemType();
								}, 'error-all');
			};

					$scope.addBrand = function() {
							var data = {
									brandname : $scope.brand.brandname
							};

						restService.postRestDataAsJson("brandIgnoreDuplicate", data, function(resultPromise) {
											var message = "Data Saved ...";
											utilityService.showMessage('success', message,null, null);
											$scope.brand.brandname = "";
											$scope.showAddBrand();
										}, 'error-all');
					};

					$scope.showAddUnitCategory = function() {
						if ($scope.isShowUnitCategory == false) {
							$scope.addUnitCategoryButton = "Hide";
							$scope.isShowUnitCategory = true;
						} else {
							$scope.isShowUnitCategory = false;
							$scope.addUnitCategoryButton = "Add";
						}

					};

					$scope.addUnitCategory = function() {
							var data = {
									unit : $scope.unitCategory.unit
								};

						restService.postRestDataAsJson("distinctUnit", data,function(resultPromise) {
										var message = "Data Saved ...";
										utilityService.showMessage('success',message, null, null);
										$scope.unitCategory.unit = "";
										$scope.showAddUnitCategory();
									}, 'warning-all');
					};

					$scope.addItems = function() {

							$scope.item.grocerycategoryid = $scope.dataGroceryDropDown.repeatSelectGrocery;
							$scope.item.itemcategoryid = $scope.dataItemCatDropDown.repeatSelectItem;
							$scope.item.itemtypeid = $scope.dataItemTypeDropDown.repeatSelectItemType;
							$scope.item.unit = $scope.dataUnitDropDown.repeatSelectUnit != 'Other' ? $scope.dataUnitDropDown.repeatSelectUnit : $scope.unitCategory.unit;
							$scope.item.imageid = $scope.uploadedImage.id;

						restService.postRestDataAsJson("items", $scope.item,function(resultPromise) {
										var message = "Data Saved ...";
										utilityService.showMessage('success',message, null, null);
										$scope.item.itemcategoryid = "";
										$scope.item.itemtypeid = "";
										$scope.item.itemname = "";
										$scope.item.unit = "";
										$scope.item.itemdescription = "";
										$scope.item.cost = "";
									}, 'warning-all');
					};

					$scope.isUpload = true;
					$scope.uploadedImage = {};

					$scope.deleteItemFile = function() {
							var url = "image/" + $scope.uploadedImage.id;
							restService.deleteRestData(url, function() {
									$scope.isUpload = true;
									$scope.uploadedImage = {};
								}, 'warning-all');
					};

					$scope.uploadFile = function() {
								var file = $scope.myFile;
								console.log('file is ');
								console.dir(file);
								var uploadUrl = "itemImageUpload";
								fileUpload.uploadFileToUrl(file, uploadUrl).then(function(response) {
										$scope.uploadedImage = response.data;
								});
						;
							$scope.isUpload = false;
					};

				});

		addItem.directive('fileModel', [ '$parse', function($parse) {
					return {
						restrict : 'A',
							link : function(scope, element, attrs) {
							var model = $parse(attrs.fileModel);
							var modelSetter = model.assign;

							element.bind('change', function() {
							scope.$apply(function() {
							modelSetter(scope, element[0].files[0]);
							});
							});
							}
				};
	} ]);

		addItem.service('fileUpload', [ '$http', '$rest', function($http, $rest) {
					this.uploadFileToUrl = function(file, uploadUrl) {
						var fd = new FormData();
						fd.append('file', file);
						uploadUrl = $rest.servicePath + uploadUrl;
						var promise = $http.post(uploadUrl, fd, {
							transformRequest : angular.identity,
								headers : {
									'Content-Type' : undefined
								}
						}).success(function(result) {
								return result;
						}).error(function() {
						});

						return promise;
	};
} ]);