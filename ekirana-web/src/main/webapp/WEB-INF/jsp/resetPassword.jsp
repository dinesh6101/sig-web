<%@page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<html>
<head>
<% String version = ((java.util.Properties)application.getAttribute("environment")).getProperty("application.version"); %>
<script type="text/javascript">
		var contextPath = "<%=application.getContextPath()%>";
</script>
<title><spring:message code="i18nText.symphonyResetPassword" /></title>
<link rel="stylesheet" href="<%=application.getContextPath()%>/static/css/defaults.css?version=<%= version %>">
<link rel="shortcut icon" href="<%=application.getContextPath()%>/static/images/favicon.ico">
</head>

<body>
	<div id="loginContainer">
		<img id="logo" src="<%=application.getContextPath()%>/static/images/Logo.png" />
			<div id="imageContainer">
				<div id="loginDiv" data-ng-controller="resetPwdCntlr" style="margin-top:25px;">
					<div id="productTitle">
							<h2><spring:message code="i18nText.AppName" />&#153; <spring:message code="i18nText.EntPortal" /></h2>
					</div>
					<form class='login_form'>
						<input style="width:100%" type="text" data-ng-model="username" id="username" placeholder=" <spring:message code='i18nText.enterUsername'/>" data-ng-init="getFocus(this);">
						<input style="width:100%" type="password" data-ng-model="newPassword" id="newPassword" placeholder=" <spring:message code='i18nText.enterNewPassword'/>">
						<input style="width:100%" type="password" data-ng-model="reenterPassword" id="reenterPassword" placeholder=" <spring:message code='i18nText.enterReenterNewPassword'/>">
						<div id="floatRight">
						<img id="loading" src="<%=application.getContextPath()%>/static/images/input_spinner.gif" data-ng-show="loading"/>
						<input style="clear:both" type="button" value="SUBMIT"
							data-ng-click="validateAndSubmit();" data-ng-disabled="loading"/>
						</div>
					</form>
				</div>
					<img src="<%=application.getContextPath()%>/static/images/bg_banner.jpg" style="width:100%;">
				<div style="height: 20px; width: 100%">
					<p class="mutedText"
						style="font-size: 9pt; height: 100%; width: 100%; text-align: center">
						<spring:message code="i18nText.UseUnauthorizedProhibited" />
					</p>
				</div>
			</div>
		
	</div>
	<!-- JS FILES -->
	<script src="<%=application.getContextPath()%>/static/js/vendor/jQuery/jquery-1.9.1.min.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/vendor/i18n/jquery.i18n.properties.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/vendor/angular/angular.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/vendor/angular/angular-route.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/vendor/angular/angular-resource.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/vendor/angular/angular-cookies.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/vendor/bootstrap/ui-bootstrap-tpls-0.11.0.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/vendor/toastr/toastr.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/app/shared-modules/modal-module.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/app/shared-modules/util-module.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/app/shared-modules/rest-module.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/app/shared-modules/storage-module.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/app/shared-modules/common-module.js?version=<%= version %>"></script>
	<script src="<%=application.getContextPath()%>/static/js/app/reset-pwd-app.js?version=<%= version %>"></script>
	<script>
		var sc = '${sc}';
		var un = '${un}';
		angular.element(document).ready(
				function() {
					var $injector = angular.injector([ 'ng', 'ngCookies',
							'utilModule', 'restModule',
							'storageModule' ]);
					$injector.invoke(function($rest, symphonyRestService, utilityService, contextStorage) {
						utilityService.loadLanguage();
						angular.bootstrap(document, [ 'resetPwdApp' ]);
					});
				});
	</script>
</body>
</html>