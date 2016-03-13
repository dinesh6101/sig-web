'use strict';

var storageModule = angular.module('storageModule', [ 'ng','utilModule']);

storageModule.factory('contextStorage', function($log) {
	var logger = $log.getLogger("contextStorage", false);
	
	var currentClient = null;
	var currentClientDistricts = null;
	var currentSiteList = null;
	var currentUserData = null;
	var currentSiteRankings = null;
	var currentSiteDetails = null;
	var currentSiteConfigToEdit = null;
	var currentClientTimeouts = null;
	var siteExceptionsData = null;
	
	var contextStorage = {
	    setCurrentClient : function(client) {
		    currentClient = client;
	    },
	    getCurrentClient : function() {
		    return currentClient;
	    },
	    setCurrentClientDistricts : function(districts) {
	    	currentClientDistricts = districts;
	    },
	    getCurrentClientDistricts : function() {
	    	return currentClientDistricts;
	    },
	    setCurrentSiteList : function(siteList) {
		    currentSiteList = siteList;
	    },
	    getCurrentSiteList : function() {
		    return currentSiteList;
	    },
	    setCurrentUserData : function(userData) {
		    currentUserData = userData;
	    },
	    getCurrentUserData : function() {
		    return currentUserData;
	    },
	    setCurrentSiteRankings : function(rankingList) {
	    	currentSiteRankings = rankingList;
	    },
	    getCurrentSiteRankings : function() {
		    return currentSiteRankings;
	    },
	    setCurrentSiteDetails: function(siteDetails){
	    	currentSiteDetails = siteDetails;
	    },
	    getCurrentSiteDetails: function(s){
	    	return currentSiteDetails;
	    },
	    setCurrentSiteConfigToEdit: function(siteDetails){
	    	currentSiteConfigToEdit = siteDetails;
	    },
	    getCurrentSiteConfigToEdit: function(){
	    	return currentSiteConfigToEdit;
	    },
	    setCurrentClientTimeouts: function(timeouts){
	    	currentClientTimeouts = timeouts;
	    },
	    getCurrentClientTimeouts: function(){
	    	return currentClientTimeouts;
	    },
	    setSiteExceptionsData : function(exceptionData) {
	    	siteExceptionsData = exceptionData;
	    },
	    getSiteExceptionsData : function() {
		    return siteExceptionsData;
	    },
	};
	return contextStorage;
});
