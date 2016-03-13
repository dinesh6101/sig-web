'use strict';

var sitesHelperModule = angular.module('sitesHelperModule', [ 'ng','utilModule','restModule','storageModule']);

sitesHelperModule.factory('siteHelper', function($log,contextStorage) {
		
	return {
		sites : null,
		siteNumbers : [],
		populateSites : function() {
			var currentClient = contextStorage.getCurrentClient();
		    if (currentClient) {
			    this.sites = contextStorage.getCurrentSiteList();
			    if (this.sites == null) {
				    restService.getRestData(currentClient.sites.resourceLocation, function(result) {
					    contextStorage.setCurrentSiteList(result);
					    this.sites = result;
					    this.fillSiteNumbers(this.sites);
				    }, function(emsg,ecode){
				    	utilityService.showMessage('warning', emsg, ecode, [404]);
				    });
			    } else {
				    this.fillSiteNumbers();
			    }
		    }
		    return this.sites;
		},
		fillSiteNumbers : function() {
			var siteNums = [];
			angular.forEach(this.sites, function(site) {
			    var siteNumber = "" + site.siteNumber;
			    siteNums.push(siteNumber);
		    });
		    this.siteNumbers = siteNums;
		},
		findSiteBySiteNumber : function(siteNumber) {
		    var siteObj;
		    if (!this.sites) {
		    	this.populateSites();
		    }
		    angular.forEach(this.sites, function(site) {
			    if (parseInt(site.siteNumber) == parseInt(siteNumber)) {
				    siteObj = site;
			    }
		    });

		    return siteObj;
	    }
	};
});