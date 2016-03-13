<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div class="navslice">
	<div id="nav-container">
		<div class="nav-item nav-right" onclick="window.location='about-us.html'">
			<span><spring:message code="i18nText.AboutUs" /></span>
		</div>
		<div class="nav-item" onclick="window.location='delivery.html'">
			<span><spring:message code="i18nText.Delivery" /></span>
		</div>		
		<div class="nav-item" onclick="window.location='home.html'">
			<span><spring:message code="i18nText.Home" /></span>
		</div>
    	<div style="clear: both;"></div>
    </div>
</div>