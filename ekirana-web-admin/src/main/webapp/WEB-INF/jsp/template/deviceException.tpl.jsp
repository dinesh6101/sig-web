<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<div>
	<table class="exceptionlist" data-ng-show='exceptionError == null'>
		<caption><spring:message code="i18nText.Exceptions" /></caption>
		<thead><tr>
			<th><span data-ng-click="predicate = 'sensorKey'; reverse=!reverse" > <spring:message code="i18nText.Device" /></span></th>
			<th class="extrawide"><span data-ng-click="predicate = 'message'; reverse=!reverse" > <spring:message code="i18nText.Message" /></span></th>
			<th><span data-ng-click="predicate = 'start.value'; reverse=!reverse" > <spring:message code="i18nText.startTime" /></span></th>
			<th><span data-ng-click="predicate = 'end.value'; reverse=!reverse" > <spring:message code="i18nText.endTime" /></span></th>
		</tr></thead>
		<tbody>
		<tr data-ng-click="openExceptionViewer(exception);" data-ng-repeat="exception in exceptions | orderBy:predicate:reverse">
			<td>{{exception.sensorKey}}</td>
			<td class="extrawide">{{exception.message}}</td>
			<td style="white-space:nowrap">{{exception.start.textRepresentation}}</td>
			<td style="white-space:nowrap">{{exception.end.textRepresentation}}<span data-ng-show='exception.end == null'><spring:message code="i18nText.Ongoing" /></span></td>			
		</tr>
		</tbody>
	</table>
	
	<div  class="noexceptions" data-ng-show='exceptionError != null'>
		{{exceptionError.message}}
	</div>
</div>