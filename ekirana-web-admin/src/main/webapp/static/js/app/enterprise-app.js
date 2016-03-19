'use strict';

var entApp = angular.module('entApp', [ 'ngRoute', 
                                                        'restModule', 
                                                        'storageModule', 
                                                        'commonModule'
                                                        ]);

entApp.config(function($routeProvider) {

	$routeProvider.when('/dashboard', {
	    templateUrl : contextPath + "/ui/ent/dashboard",
	    controller : 'EntDashboardCntlr'
	}).when('/sites', {
	    templateUrl : contextPath + "/ui/ent/sites",
	    controller : 'EntSitesCntlr',
	    resolve : {
		    sites : function(restService, utilityService, contextStorage) {
			    //temporary url, may be whole client object will be passed
			    var currentClient = contextStorage.getCurrentClient();
			    if (currentClient) {
			    	var sites = contextStorage.getCurrentSiteList();
			    	if(sites==null){
					    return restService.getRestData(currentClient.sites.resourceLocation, function(sites) {
					    	contextStorage.setCurrentSiteList(sites);
						    return sites;
					    }, function(emsg,ecode){
					    	utilityService.showMessage('error',emsg);
					    });
			    	}else{
			    		return sites;
			    	}
			    } else {
				    //No client exists in cookie give error message or forward back to client selection page
			    }
		    }
	    }
	}).when('/reports', {
	    templateUrl : contextPath + "/ui/ent/report-list",
	    controller : 'ReportController',
	    resolve : {
		    reports : function($log, $rest, reportService, searchFilter, contextStorage) {
			    angular.element('#searchText').val('');
			    searchFilter.searchText = "";
			    var currentClient = contextStorage.getCurrentClient();
			    return reportService.getClientReportList(currentClient.resourceLocation + $rest.reportsPath);
		    }
	    }
	}).when('/help', {
	    templateUrl : contextPath + "/ui/ent/help",
	    controller : 'HelpController',
	    resolve : {
		    	resources : function($log, $rest, contextStorage, restService) {
		    		
		    		var client = contextStorage.getCurrentClient();
		    		return restService.getRestData(client.resourceLocation+$rest.resourcesGroupByCategoryPath, function(resources) {return resources;}, 'warning-all');		    		
		    	},
				clientContacts : function($log, $rest, contextStorage, restService) {
					var client = contextStorage.getCurrentClient();
					return restService.getRestData(client.resourceLocation+$rest.contactsPath, function(clientContacts) {return clientContacts;}, 'warning-all');		    		
				}
		    }
	}).when('/graphs', {
	    templateUrl : contextPath + "/ui/ent/graphs"
	    
	}).when('/activities', {
	    templateUrl : contextPath + "/ui/ent/activities",
	    controller : 'ActivitiesController',
	    resolve : {
	    	activities : function($log, $rest, $cookies, contextStorage, restService, utilityService) {
	    		//start - get date range for last 14 days
	    		//e.g. - ?start=03-31-2014&finish=04-01-2014  
	    		var now = new Date();
	    		var finish = "" + (now.getMonth()+1) + "-" + (now.getDate()+1) + "-" + now.getFullYear(); 
	    		//+1 for month as month value starts with 0
	    		//+1 for day, as we want to include todays entry and not before today
	    		
	    		var  prev = new Date();
	    		prev.setDate(now.getDate() - 14 + 1); //last 14 days activities to be fetched //+1 as month value starts with 0
	    		var start = "" + (prev.getMonth() +1) + "-" + prev.getDate() + "-" + prev.getFullYear(); //+1 as month value starts with 0	    		
	    		var dateRange = "?start=" + start + "&finish=" + finish;
	    		//end - get date range for last 14 days
	    		
	    		var client = contextStorage.getCurrentClient();
	    		var activitiesPathForDuration = $rest.activitiesPath + dateRange + "&clientId="+client.id;
	    		return restService.getRestData(activitiesPathForDuration, function(activities) {
    			    return activities;
				}, 'warning-all');	
	    		
	    		/*var userData = contextStorage.getCurrentUserData();
				if(userData==null){
					return restService.getRestData($rest.currentUserPath, function(userData) {
						contextStorage.setCurrentUserData(userData);
			    		
			    		var userId = userData.user.id;
			    		//var activitiesPathForDuration = $rest.activitiesPath + dateRange + "&userId="+userId;
			    		
			    		return restService.getRestData(activitiesPathForDuration, function(activities) {
			    			    return activities;
					    }, 'warning-all');			 
						
				    }, 'error-all');
				}else{
					var userId = userData.user.id;
					//var activitiesPathForDuration = $rest.activitiesPath + dateRange + "&userId="+userId;
					return restService.getRestData(activitiesPathForDuration, function(activities) {
	    			    return activities;
					}, 'warning-all');	
				}*/
		    }
	    }
	}).when('/global-changes', {
	    templateUrl : contextPath + "/ui/ent/globalChanges",
	    controller : 'GlobalChangesController' ,
	    resolve: {
	    	user: function($log, $rest, contextStorage, restService) {
				var userData = contextStorage.getCurrentUserData();
				if(userData==null){
					restService.getRestData($rest.currentUserPath, function(userData) {
						contextStorage.setCurrentUserData(userData);
					    return userData;
				    }, 'error-all');
				}else{
					return userData;
				}
			}
	    }
    }).when('/support', {
    	templateUrl : contextPath + "/ui/ent/support",
    	controller : 'supportCtrl',
    	resolve : {
			clientContacts : function($log, $rest, contextStorage, restService) {
				var client = contextStorage.getCurrentClient();
				return restService.getRestData(client.resourceLocation+$rest.contactsPath, function(clientContacts) {return clientContacts;}, 'warning-all');		    		
			},
		    openTickets : function($rest, utilityService, restService, contextStorage) {
		    	var currentClient = contextStorage.getCurrentClient();
		    	if (currentClient) {
		    		if (currentClient.name) {
		    			var clientName = currentClient.name;
		    			if (clientName == "Mitchells") { //Remove before deploying to production
		    				clientName = "Michaels";
		    			}
		    			return restService.getRestData($rest.ticketPath + "open/" + clientName, function(tickets) {
					    	//console.log("Got open tickets: " + JSON.stringify(tickets));
						    return tickets;
					    }, function(emsg,ecode){
					    	utilityService.showMessage('error',emsg);
					    });
		    		}	
		    	} else {
				    //No client exists in cookie give error message or forward back to client selection page
		    	}
		    },
		    recentTickets : function($rest, utilityService, restService, contextStorage) {
		    	var currentClient = contextStorage.getCurrentClient();
		    	if (currentClient) {
		    		if (currentClient.name) {
		    			var clientName = currentClient.name;
		    			if (clientName == "Mitchells") { //Remove before deploying to production
		    				clientName = "Michaels";
		    			}
		    			return restService.getRestData($rest.ticketPath + "recent/" + clientName + "?days=30", function(ticketList) {
					    	//console.log("Got recent tickets: " + JSON.stringify(ticketList));
						    return ticketList;
					    }, function(emsg,ecode){
					    	utilityService.showMessage('error',emsg);
					    });
		    		}	
		    	} else {
				    //No client exists in cookie give error message or forward back to client selection page
		    	}
		    },
	        recentWorkorders : function($rest, restService, contextStorage) {
	        	var client = contextStorage.getCurrentClient();
	        	var recentWorkorderUrl = $rest.recentWorkorderPath + "/" + client.id;
	        	return restService.getRestData(recentWorkorderUrl, function(result) {
	        		//console.log("Got list of workorder summaries: " + JSON.stringify(result));
				    return result;
			    }, 'error-all');
	        },
		    client : function(contextStorage) { return contextStorage.getCurrentClient(); },
		    site   : function() {return null;},
		    exceptions : function() {return null;}
	    }
	}).otherwise({
		redirectTo : "/dashboard"
	});
	
	//Open goToSite with Ctrl+alt+S
	$(window).bind('keydown', function(event) {
	    if (event.altKey && event.ctrlKey) {
	        switch (String.fromCharCode(event.which).toLowerCase()) {
	        case 's':
	            event.preventDefault();
	            $("#bottom-right-toolbar").slideToggle(500);
	            $("#bottom-right-toolbar > input").focus();
	            break;
	        }
	    }
	});
	//Close goToSite and notifications window with 'esc'
	$(document).on('keyup',function(evt) {
	    if (evt.keyCode == 27) {
	       $("#bottom-right-toolbar").slideUp(500);
	       $("#notifications-div").hide();
	    }
	});
	//Close notifications if click is outside notifications area
	$(document).on("click",function(e) {
		if ($(e.target).parents(".usercontrols").length == 0) {
			console.log("hiding..." + $(e.target).attr("class"));
			$("#notifications-div").hide();
			e.stopPropagation();
		}
	});
}).run(function(utilityService, contextStorage) {
	//utilityService.loadLanguage();
});

entApp.config(function($logProvider) {
	/** Global debugging on/off setting **/
	$logProvider.debugEnabled(true);
});

entApp.controller('PermissionCntlr', function($rootScope, $scope, $log, $location, searchFilter, $rest, restService) {
	var logger = $log.getLogger("PermissionController", false);
	var accessTokens = [];
	restService.getRestData($rest.currentUsersAccessTokensPath, function(data) {
		accessTokens = data.tokens;
	}, 'warning-all');
	var callCount = 0;
	$scope.checkToken = function(token) {
		for (var i = 0; i < accessTokens.length; i++) {
			if (accessTokens[i] == 'ALL' || accessTokens[i] == token) {
				return true;
			}
		}
		return false;
	};
});

entApp.filter('siteSearch', function() {
	var matchList = null;

	return function(sites, search, pseudoList) {
		var listToReturn;
		if (sites) {
			if (search) {
				var terms = __parse(search);

				if (terms.length > 0) {

					var sitenoMatch = new Array();
					var siteidMatch = new Array();
					var stateMatch = new Array();
					var coMatch = new Array();
					var distMatch = new Array();
					var zoneMatch = new Array();
					var regMatch = new Array();
					var pcMatch = new Array();
					var ipMatch = new Array();
					var otherMatch = new Array();

					for (var i = 0; i < terms.length; ++i) {
						var match = false;
						var t = terms[i].toLowerCase();
						
						if (__isIPAddr(t)) {
							ipMatch[ipMatch.length] = t;
						} else if (__isSiteId(t)) {
							siteidMatch[siteidMatch.length] = t.substring(1, t.length);
						} else if (__isSiteNo(t)) {
							sitenoMatch[sitenoMatch.length] = t.substring(1, t.length);
						} else if (__isCountry(t)) {
							coMatch[siteidMatch.length] = t.substring(1, t.length);
						} else if (__isAllDigits(t)) {
							if (__matchAnySiteno(t, sites)) {
								sitenoMatch.push(t);
								match = true;
							} else if (__matchAnyDist(t, sites)) {
								distMatch.push(t);
								match = true;
							} else if (__matchAnyZone(t, sites)) {
								zoneMatch.push(t);
								match = true;
							} else if (__matchAnyReg(t, sites)) {
								regMatch.push(t);
								match = true;
							} else if (__matchAnyPC(t, sites)) {
								pcMatch.push(t);
								match = true;
							}
							if (!match) {
								if(t.length > 1) {	
									otherMatch.push(t); // only if t has more than one char
								}
							}
						} else {
							if ((t.length == 2) && __matchAnyState(t, sites)) {
								stateMatch.push(t);
								match = true;
							}
							if (__matchAnyDist(t, sites)) {
								distMatch.push(t);
								match = true;
							} else if (__matchAnyZone(t, sites)) {
								zoneMatch.push(t);
								match = true;
							} else if (__matchAnyReg(t, sites)) {
								regMatch.push(t);
								match = true;
							} else if (__matchAnyPC(t, sites)) {
								pcMatch.push(t);
								match = true;
							}
							if (!match) {
								otherMatch.push(t);
							}
						}
					} // end for

					var matches = new Array();
					for (var i = 0; i < siteidMatch.length; ++i) {
						var s = siteidMatch[i];
						__matchSiteid(s, sites, matches);
					}
					for (var i = 0; i < sitenoMatch.length; ++i) {
						var s = sitenoMatch[i];
						__matchSiteno(s, sites, matches);
					}
					for (var i = 0; i < stateMatch.length; ++i) {
						var s = stateMatch[i];
						__matchState(s, sites, matches);
					}
					for (var i = 0; i < coMatch.length; ++i) {
						var c = coMatch[i];
						__matchCo(c, sites, matches);
					}
					for (var i = 0; i < distMatch.length; ++i) {
						var s = distMatch[i];
						__matchDist(s, sites, matches);
					}
					for (var i = 0; i < zoneMatch.length; ++i) {
						var s = zoneMatch[i];
						__matchZone(s, sites, matches);
					}
					for (var i = 0; i < regMatch.length; ++i) {
						var s = regMatch[i];
						__matchReg(s, sites, matches);
					}
					for (var i = 0; i < pcMatch.length; ++i) {
						var s = pcMatch[i];
						__matchPostalCode(s, sites, matches);
					}
					for (var i = 0; i < ipMatch.length; ++i) {
						var s = ipMatch[i];
						__matchIP(s, sites, matches);
					}

					for (var i = 0; i < otherMatch.length; ++i) {
						var t = otherMatch[i];
						__matchOtherProp(t, sites, matches)
					}

					matchList = matches;
					listToReturn = matchList;
				} else {
					listToReturn = sites;					
				}
			} else {
				listToReturn = sites;
			}
		} else {
			listToReturn = null;
		}
		//Added By Amit to limit the site list when external filter like watch-list clicked
		if(pseudoList != null){
			var filteredList = [];
			var counter = 0;
			if(listToReturn!=null && listToReturn.length>0){
				for(var i=0; i<listToReturn.length; i++){
					var site = listToReturn[i];
		    		for(var j=0; j<pseudoList.length; j++){
		    			var wId = pseudoList[j];
		    			if(wId == site.siteId){
		    				filteredList[counter++] = site;
		    			}
		    		}
				}
				listToReturn = filteredList;
			}
		}
		//
		return listToReturn;
	};
});

/* Site match functions */
function __matchSiteno(t, sl, m) {
	var tno = parseInt(t);
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		var sno = parseInt(s.siteNumber);

		if (sno == tno) {
			__addMatch(s, m);
			break;
		}
	}
}

function __matchSiteid(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if (s.siteId == t) {
			__addMatch(s, m);
			break;
		}
	}
}

function __matchState(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.location.state != null) && (s.location.state.toLowerCase() == t)) {
			__addMatch(s, m);
		}
	}
}

function __matchCo(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.location.country != null) && (s.location.country.toLowerCase() == t)) {
			__addMatch(s, m);
		}
	}
}

function __matchDist(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.districtName != null) && (s.districtName.toLowerCase() == t)) {
			__addMatch(s, m);
		}
	}
}

function __matchZone(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.zoneName != null) && (s.zoneName.toLowerCase() == t)) {
			__addMatch(s, m);
		}
	}
}

function __matchReg(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.regionName != null) && (s.regionName.toLowerCase() == t)) {
			__addMatch(s, m);
		}
	}
}

function __matchPostalCode(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.location.postalcode != null) && (s.location.postalcode.toLowerCase() == t)) {
			__addMatch(s, m);
		}
	}
}

function __matchIP(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.ipAddress != null) && (s.ipAddress.indexOf(t) >= 0)) {
			__addMatch(s, m);
		}
	}
}

function __matchOtherProp(t, sl, m) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.storeName != null) && (s.storeName.toLowerCase().indexOf(t) >= 0)) {
			__addMatch(s, m);
			continue;
		}
		if ((s.location.city != null) && (s.location.city.toLowerCase().indexOf(t) >= 0)) {
			__addMatch(s, m);
			continue;
		}
		if ((s.location.street != null) && (s.location.street.toLowerCase().indexOf(t) >= 0)) {
			__addMatch(s, m);
			continue;
		}
		if ((s.telephone != null) && (s.telephone.toLowerCase().indexOf(t) >= 0)) {
			__addMatch(s, m);
			continue;
		}
	}
}

function __matchAnySiteno(t, sl) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if (s.siteNumber == t) {
			return true;
		}
	}
	return false;
}

function __matchAnyState(t, sl) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.location.state != null) && (s.location.state.toLowerCase() == t)) {
			return true;
		}
	}
	return false;
}

function __matchAnyDist(t, sl) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.districtName != null) && (s.districtName.toLowerCase() == t)) {
			return true;
		}
	}
	return false;
}

function __matchAnyZone(t, sl) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.zoneName != null) && (s.zoneName.toLowerCase() == t)) {
			return true;
		}
	}
	return false;
}

function __matchAnyReg(t, sl) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.regionName != null) && (s.regionName.toLowerCase() == t)) {
			return true;
		}
	}
	return false;
}

function __matchAnyPC(t, sl) {
	for (var i = 0; i < sl.length; ++i) {
		var s = sl[i];
		if ((s.location.postalcode != null) && (s.location.postalcode.toLowerCase() == t)) {
			return true;
		}
	}
	return false;
}

function __isDelimiter(c) {
	var delim = false;

	if (c == ",") {
		delim = true;
	} else if (c == " ") {
		delim = true;
	} else if (c == ";") {
		delim = true;
	} else if (c == "/") {
		delim = true;
	} else if (c == "\t") {
		delim = true;
	} else if (c == "\f") {
		delim = true;
	} else if (c == "\r") {
		delim = true;
	}
	return delim;
}

function __isQuote(c) {
	var quote = false;

	if (c == "\"") {
		quote = true;
	} else if (c == "\'") {
		quote = true;
	}
	return quote;
}

function __isAllDigits(t) {
	for (var i = 0; i < t.length; ++i) {
		var c = t.charAt(i);
		if ((c < "0") || (c > "9")) {
			return false;
		}
	}
	return true;
}

function __isSiteId(term) {
	if (term.length > 1) {
		for (var i = 0; i < term.length; ++i) {
			var c = term.charAt(i);
			if (i == 0) {
				if (c != "#") {
					return false;
				}
			} else if ((c < "0") || (c > "9")) {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
}

function __isSiteNo(term) {
	if (term.length > 1) {
		for (var i = 0; i < term.length; ++i) {
			var c = term.charAt(i);
			if (i == 0) {
				if (c != "!") {
					return false;
				}
			} else if ((c < "0") || (c > "9")) {
				return false;
			}
		}
	} else {
		return false;
	}
	return true;
}

function __isCountry(term) {
	if(term.length == 3) {
		if(term.charAt(0) == "~") {
			return true;
		}
	}
	return false;
}

function __isIPAddr(term) {
	var hasDigit = false;
	var hasDecimal = false;

	if (term.length > 1) {
		for (var i = 0; i < term.length; ++i) {
			var c = term.charAt(i);
			if (c == ".") {
				hasDecimal = true;
			} else if ((c >= "0") && (c <= "9")) {
				hasDigit = true;
			} else {
				return false;
			}
		}
	}
	return (hasDigit & hasDecimal);
}

function __parse(txt) {
	var terms = new Array();
	var state = "D";
	var term = "";
	var minTermLen = 2; // search terms must have more than one character to be used
	
	for (var i = 0; i < txt.length; ++i) {
		var c = txt.charAt(i);

		switch (state) {
		case "D":
			if (__isDelimiter(c)) {
				// continue on...
			} else if (__isQuote(c)) {
				term = "";
				state = "Q";
			} else {
				term = c;
				state = "T";
			}
			break;

		case "Q":
			if (__isDelimiter(c)) {
				term = term + c;
			} else if (__isQuote(c)) {
				var t = term;
				term = "";
				if (t.length >= minTermLen) {
					terms[terms.length] = t.toLowerCase();
				}
				state = "D";
			} else {
				term = term + c;
			}
			break;

		case "T":
			if (__isDelimiter(c)) {
				var t = term;
				term = "";
				if (t.length >= minTermLen) {
					terms[terms.length] = t.toLowerCase();
				}
				state = "D";
			} else if (__isQuote(c)) {
				var t = term;
				term = "";
				if (t.length >= minTermLen) {
					terms[terms.length] = t.toLowerCase();
				}
				state = "Q";
			} else {
				term = term + c;
			}

			break;
		}
	}
	if (term.length >= minTermLen) {
		terms[terms.length] = term.toLowerCase();
	}

	return terms;
}

function __addMatch(s, matches) {
	var exists = false;
	for (var i = 0; i < matches.length; ++i) {
		var site = matches[i];
		if (site.siteId == s.siteId) {
			exists = true;
			break;
		}
	}
	if (!exists) {
		matches.push(s);
	}
}