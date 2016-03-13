<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<% String version = ((java.util.Properties)application.getAttribute("environment")).getProperty("application.version"); %>
<link rel="stylesheet" href="<%= application.getContextPath() %>/static/css/bootstrap/bootstrap-modal.css?version=<%= version %>">
<link rel="stylesheet" href="<%= application.getContextPath() %>/static/css/special.css?version=<%= version %>">
<div class="modal-header">
	<h3 align="center"><spring:message code='i18nText.changeUserInfo'/></h3>
</div>
<div class="modal-body modalWin">
	<table align="center">
		<tr>
			<td align="right">
				<spring:message code='i18nText.fullName'/>
			</td>
			<td align="left">
				<input style="width:100%;" size="20" type="text" data-ng-model="i_fullName" id="i_fullName" autocomplete="off">
			</td>
		</tr>
		<tr>
			<td align="right">
				<spring:message code='i18nText.userNameEmail'/>
			</td>
		 	<td align="left">
		 		<input style="width:100%;" size="25" type="text" data-ng-model="i_userName" id="i_userName" autocomplete="off" disabled='disabled'>
		 	</td>
		</tr>
		<tr>
			<td/>
			<td>
		 		<font color='#DD4444' size='1'><i><spring:message code='i18nText.callCustSupportToChangeUserName'/></i></font>
		 	</td>
		</tr>
		<tr>
			<td align="right"><spring:message code='i18nText.changePassword'/></td>
		 	<td  align="left"><input type="checkbox" data-ng-model="i_changePass" id="i_changePass" autocomplete="off" data-ng-click="changePassword();"></td>
		</tr>
		</table>
		<div id="changePwdDiv" style="display:none;width:100%">
			<table align="center">
				<tr>
					<td align='right'>
						 <spring:message code="i18nText.currentPassword" />
					</td>
					<td align='left'>
						 <input type="password" data-ng-model="currentPassword" id="currentPassword">
					</td>
				</tr>
				<tr>
					<td align='right'>
						 <spring:message code="i18nText.newPassword" />
					</td>
					<td align='left'>
						 <input type="password" data-ng-model="newPassword" id="newPassword">
					</td>
				</tr>
				<tr>
					<td align='right'>
						 <spring:message code="i18nText.reenterNewPassword" />
					</td>
					<td align='left'>
						 <input type="password" data-ng-model="reenterPassword" id="reenterPassword">
					</td>
				</tr>		 	
			</table>
		</div>
</div>
<div class="modal-footer" align="center">
	<table align="center">
		<tr>
			<td align='right'>
				<button data-ng-click="buttonSubmit(i_fullName,i_userName,i_changePass,currentPassword,newPassword,reenterPassword);"><spring:message code='i18nText.submit'/></button>
			</td>
			<td>
				<button data-ng-click="buttonCancel();"><spring:message code='i18nText.cancel'/></button>
			</td>
		</tr>
	</table>
			
</div>