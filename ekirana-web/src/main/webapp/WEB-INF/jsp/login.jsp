<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page import="java.util.Properties" %>
<!DOCTYPE html>
<html xmlns:ng="http://angularjs.org" id="ng-app" >
<head>

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<script type="text/javascript">
			var contextPath = "<%=application.getContextPath()%>";
	</script>
	<% String version = ((java.util.Properties)application.getAttribute("environment")).getProperty("application.version"); %>	
	<title><spring:message code="i18nText.loginPageTitle"/></title>
	<link rel="stylesheet" href="<%=application.getContextPath()%>/static/css/defaults.css?version=<%= version %>">
	<link rel="shortcut icon" href="<%=application.getContextPath()%>/static/images/favicon.ico">
	<!--[if lt IE 9]>
	    <script>
	        document.createElement('header');
	        document.createElement('nav');
	    </script>
	<![endif]-->
</head>
<body>
	<div id="loginContainer">
		<img id="logo" src="<%=application.getContextPath()%>/static/images/Logo.png" />
			<div id="imageContainer">
			<div id="loginDiv">
			<div id="productTitle">
						<h2><spring:message code="i18nText.AppName" />&#153; <spring:message code="i18nText.EntPortal" /></h2>
						<div><span class="release">v<%= version %></span></div>
			</div>
				<form class='login_form' data-ng-controller="loginCntlr" data-ng-init="rememberUser()">				
					<input type="text" data-ng-model="j_username" placeholder=" <spring:message code='i18nText.enterUsername' />" id="j_username" autocomplete="on"/>
					<input type="password" data-ng-model="j_password" placeholder=" <spring:message code='i18nText.enterPassword' />" id="j_password" data-ng-enter="validateAndSubmit();"/>
					<div style="clear:both">
						<a href="javascript:void(0);" data-ng-click="forgotPassword();">
							<span style="font-size: 9pt"> <spring:message code="i18nText.Forgotyourpassword" /></span></a>
						<div id="floatRight">
							<img id="loading" src="<%=application.getContextPath()%>/static/images/input_spinner.gif" data-ng-show="loading"/>	
							<input type="button" value="Login" data-ng-click="validateAndSubmit();" data-ng-disabled="loading"/>
						</div>
					</div>			
				</form>
				</div>
				<div id="resetPwdDiv" >
					<form class='login_form' data-ng-controller="loginCntlr">
					<div id="productTitle">
						<h2><spring:message code="i18nText.AppName" />&#153; <spring:message code="i18nText.EntPortal" /></h2>
					</div>
						<div><span class="forgotPassword"> <spring:message code="i18nText.Forgotyourpassword" /></span></div>
						<div><input type="text" data-ng-model="fp_username" placeholder=" <spring:message code='i18nText.enterUsername' />" id="fp_username"></div>
						<div><input type="button" value="SUBMIT"
							data-ng-click="requestPasswordReset();"/></div>
					</form>
				</div>
				<img src="<%=application.getContextPath()%>/static/images/bg_banner.jpg" style="width:100%;">
			</div>
					
		<div style="height: 20px; width: 100%">
					<p class="mutedText"
						style="font-size: 9pt; height: 100%; width: 100%; text-align: center">
						<spring:message code="i18nText.UseUnauthorizedProhibited" />
					</p>
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
	<script src="<%=application.getContextPath()%>/static/js/app/login-app.js?version=<%= version %>"></script>
	<script>
		var sc = '${sc}';
		angular.element(document).ready(
				function() {
					var $injector = angular.injector([ 'ng', 'ngCookies',
							'utilModule', 'restModule',
							'storageModule' ]);
					$injector.invoke(function($rest, restService, utilityService, contextStorage) {
						utilityService.loadLanguage();
						angular.bootstrap(document, [ 'loginApp' ]);
					});
				});
	</script>
</body>
</html>