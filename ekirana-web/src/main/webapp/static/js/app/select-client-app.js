//for select client screen
var clientApp = angular.module('clientApp', [ 'ngCookies', 'utilModule','restModule','commonModule' ]);
clientApp.controller('SelectClientCntlr', function($scope, $rest, restService, utilityService) {
	utilityService.loadLanguage();
	$scope.clients = [];
	restService.getRestData($rest.clientsPath,function(clients){$scope.clients=clients;},'error-all');
	$scope.showMain = function(client) {
		window.location.replace("ent/client-details.load?clientId="+client.id);
	};
});
