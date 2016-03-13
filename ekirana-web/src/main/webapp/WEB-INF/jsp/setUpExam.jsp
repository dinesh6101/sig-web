<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!DOCTYPE html>
<html xmlns:ng="http://angularjs.org" id="ng-app" data-ng-app="onlineExamApp">
<head>

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<% String version = ((java.util.Properties)application.getAttribute("environment")).getProperty("application.version"); %>
	<script type="text/javascript">
		var contextPath = "<%= application.getContextPath() %>";
	</script>
	
	<link rel="shortcut icon" href="<%= application.getContextPath() %>/static/images/favicon.ico">
	<link rel="stylesheet" href="<%= application.getContextPath() %>/static/css/ncc1701.css?version=<%= version %>">
	<link rel="stylesheet" href="<%= application.getContextPath() %>/static/css/symphony-custom.css?version=<%= version %>"/>
	<link rel="stylesheet" href="<%= application.getContextPath() %>/static/js/vendor/toastr/toastr.css?version=<%= version %>">
	<title>Setup Exam</title>
	
	<!--[if lt IE 9]>
	    <script>
	        document.createElement('header');
	        document.createElement('nav');
	    </script>
	<![endif]-->
	
</head>
<body class="sel-client-body">
<div id="overlay" class="overlayOff" align="center">
	<img src="<%= application.getContextPath() %>/static/images/loading_spinner.gif"/>
</div>
<div>
	<div class="topslice"> 
		<div class="logoimg">
	   		<img src="<%= application.getContextPath() %>/static/images/logo100.png" />
	   	</div>
	   	<div class="productname">
	   		<spring:message code="i18nText.AppName" />&#153; <spring:message code="i18nText.EntPortal" />
	   	</div>
	   	<div class="usercontrols" data-ng-controller="CommonDataController">
	   		<a href="javascript:void(0);" data-ng-click="changeUserDetails();" ng-cloak>{{userData.user.username}}</a>
	   		<a style="color: #005D5D;" href="<%= application.getContextPath() %>/j_spring_security_logout"><img src="<%= application.getContextPath() %>/static/images/logout.png" />&nbsp;<spring:message code="i18nText.Logout" /></a>
	   	</div>
	   	<div style="clear: both;"></div>
	</div>

	<div class="clients-container">
		<ul>
			<li>
				<a href="#viewExams"> View Exams </a>
			</li>
			<li>
				<a href="#addExam"> Add Exam </a>
			</li>
		</ul>
				
	  <%-- <table class="general_table clients-table">
			<thead>
				<tr>
					<th width="100%"><span class="client-name-header" data-ng-click="predicate = 'name'; reverse=!reverse"> <spring:message code="i18nText.Name" /></span>
					<input type="text" id="searchText" class="client_search_box" data-ng-model="searchFilter.searchText" type="text" placeholder='<spring:message code="i18nText.Search"/>' autofocus/></th>
				</tr>
			</thead>
			<tbody>
                <tr data-ng-repeat="client in clients | filter:searchFilter.searchText | orderBy:predicate:reverse" ng-cloak>
                    <td data-ng-click="showMain(client)"><span class="client-name-row" >{{client.name}}</span></td>
                </tr>
            </tbody>
	  </table> --%>
	  <div style="clear: both;"></div>
	</div>
	<div>
		<ng-view>Loading...</ng-view>
	</div>
	
</div>    
<div class="footer" data-ng-controller="CommonDataController" ng-cloak>
  	<span class="mutedText">SpreadITGuru<spring:message code="i18nText.AllRightsReserved" />  </span><span class="mutedText" style="padding-left:20px" > <spring:message code="i18nText.AcceptedTermsofUseAgreement" />&nbsp;{{userData.userAgreementDate}}</span>
</div>
    
	<!-- JS FILES -->
	<script src="<%= application.getContextPath() %>/static/js/vendor/jQuery/jquery-1.9.1.min.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/vendor/i18n/jquery.i18n.properties.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/vendor/angular/angular.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/vendor/angular/angular-route.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/vendor/angular/angular-resource.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/vendor/angular/angular-cookies.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/vendor/bootstrap/ui-bootstrap-tpls-0.11.0.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/vendor/toastr/toastr.js?version=<%= version %>"></script>	
	
	<script src="<%= application.getContextPath() %>/static/js/app/shared-modules/modal-module.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/app/shared-modules/util-module.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/app/shared-modules/rest-module.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/app/shared-modules/storage-module.js?version=<%= version %>"></script>
	<script src="<%= application.getContextPath() %>/static/js/app/shared-modules/common-module.js?version=<%= version %>"></script>
	
	<script src="<%= application.getContextPath() %>/static/js/app/online-exam.js?version=<%= version %>"></script>
</body>
</html>