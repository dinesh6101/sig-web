<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title> </title>

<%@include file="common/includes.jsp"%>

</head>
<body>

<%@include file="common/header.jsp"%>
 <div class="container" data-ng-app="grosaryMenu" data-ng-controller="grosaryMenuController"> 
	 	
	 	<div class=" single_top">
	      <div class="single_grid">
				<div class="grid images_3_of_2">
					<div class="flexslider">
							        <!-- FlexSlider -->
										<script src="<%=request.getContextPath()%>/static/js/imagezoom.js"></script>
										  <script defer src="<%=request.getContextPath()%>/static/js/jquery.flexslider.js">
										<link rel="stylesheet" href="css/flexslider.css" type="text/css" media="screen" />
										</script>
										<script>
										// Can also be used with $(document).ready()
										$(window).load(function() {
										  $('.flexslider').flexslider({
											animation: "slide",
											controlNav: "thumbnails"
										  });
										});
										</script>
									<!-- //FlexSlider-->
							  <ul class="slides">
								<li data-thumb="<%=request.getContextPath()%>/static/images/s4.jpg">
									<div class="thumb-image"> <img src="<%=request.getContextPath()%>/static/images/si4.jpg" data-imagezoom="true" class="img-responsive"> </div>
								</li>
								<li data-thumb="<%=request.getContextPath()%>/static/images/s2.jpg">
									 <div class="thumb-image"> <img src="<%=request.getContextPath()%>/static/images/si2.jpg" data-imagezoom="true" class="img-responsive"> </div>
								</li>
								<li data-thumb="<%=request.getContextPath()%>/static/images/s3.jpg">
								   <div class="thumb-image"> <img src="<%=request.getContextPath()%>/static/images/si3.jpg" data-imagezoom="true" class="img-responsive"> </div>
								</li>
								<li data-thumb="<%=request.getContextPath()%>/static/images/s1.jpg">
								   <div class="thumb-image"> <img src="<%=request.getContextPath()%>/static/images/si1.jpg" data-imagezoom="true" class="img-responsive"> </div>
								</li>
							  </ul>
							<div class="clearfix"></div>
					</div>						
				</div> 
				  <div class="desc1 span_3_of_2">
				  
					
					<h4>Lorem ipsum dolor sit amet, consectetur adipisicing elit</h4>
				<div class="cart-b">
					<div class="left-n ">$329.58</div>
				    <a class="now-get get-cart-in" href="#">ADD TO CART</a> 
				    <div class="clearfix"></div>
				 </div>
				 <h6>100 items in stock</h6>
			   	<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
			   	<div class="share">
							<h5>Share Product :</h5>
							<ul class="share_nav">
								<li><a href="#"><img src="<%=request.getContextPath()%>/static/images/facebook.png" title="facebook"></a></li>
								<li><a href="#"><img src="<%=request.getContextPath()%>/static/images/twitter.png" title="Twitter"></a></li>
								<li><a href="#"><img src="<%=request.getContextPath()%>/static/images/rss.png" title="Rss"></a></li>
								<li><a href="#"><img src="<%=request.getContextPath()%>/static/images/gpluse.png" title="Google+"></a></li>
				    		</ul>
						</div>
			   
				
				</div>
          	    <div class="clearfix"> </div>
          	   </div>
          	   <ul id="flexiselDemo1">
			<li><img src="<%=request.getContextPath()%>/static/images/pi.jpg" /><div class="grid-flex"><a href="#">Bloch</a><p>Rs 850</p></div></li>
			<li><img src="<%=request.getContextPath()%>/static/images/pi1.jpg" /><div class="grid-flex"><a href="#">Capzio</a><p>Rs 850</p></div></li>
			<li><img src="<%=request.getContextPath()%>/static/images/pi2.jpg" /><div class="grid-flex"><a href="#">Zumba</a><p>Rs 850</p></div></li>
			<li><img src="<%=request.getContextPath()%>/static/images/pi3.jpg" /><div class="grid-flex"><a href="#">Bloch</a><p>Rs 850</p></div></li>
			<li><img src="<%=request.getContextPath()%>/static/images/pi4.jpg" /><div class="grid-flex"><a href="#">Capzio</a><p>Rs 850</p></div></li>
		 </ul>
	    <script type="text/javascript">
		 $(window).load(function() {
			$("#flexiselDemo1").flexisel({
				visibleItems: 5,
				animationSpeed: 1000,
				autoPlay: true,
				autoPlaySpeed: 3000,    		
				pauseOnHover: true,
				enableResponsiveBreakpoints: true,
		    	responsiveBreakpoints: { 
		    		portrait: { 
		    			changePoint:480,
		    			visibleItems: 1
		    		}, 
		    		landscape: { 
		    			changePoint:640,
		    			visibleItems: 2
		    		},
		    		tablet: { 
		    			changePoint:768,
		    			visibleItems: 3
		    		}
		    	}
		    });
		    
		});
	</script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/static/js/jquery.flexisel.js"></script>

          	    	<div class="toogle">
				     	<h3 class="m_3">Product Details</h3>
				     	<p class="m_text">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.</p>
				     </div>	
          	   </div>
          	   
          	   <!---->
			<div class="sub-cate">
			<div class=" top-nav rsidebar span_1_of_left" data-ng-element-ready="init()">
				<h3 class="cate">CATEGORIES</h3>
				<ul class="menu">
					<li ng-repeat="x in dataGroceryDropDown.availableOptions"><a>{{x.grocerycategoryname}}<img
							class="arrow-img" src="<%=request.getContextPath()%>/static/images/arrow1.png" alt="" /></a>
						<ul>
							<li ng-if="x1.grocerycategoryid == x.grocerycategoryid"
								ng-repeat="x1 in dataItemCatDropDown.availableOptions">
								<ul class="show_hide">
									<li><a href = "single.html"> {{x1.itemcategoryname}}</a> <!--  <ul> 
                                <li  ng-if="x2.itemcategoryid == x1.itemcategoryid" ng-repeat="x2 in item.availableOptions"><a href="">{{x2.itemname}}</a>
                             </ul>  -->
								</ul>
							</li>
						</ul></li>
				</ul>
			</div>


				<!--initiate accordion-->
					<script type="text/javascript">
						$(function() {
						    var menu_ul = $('.menu > li > ul'),
						           menu_a  = $('.menu > li > a');
						    menu_ul.hide();
						    menu_a.click(function(e) {
						        e.preventDefault();
						        if(!$(this).hasClass('active')) {
						            menu_a.removeClass('active');
						            menu_ul.filter(':visible').slideUp('normal');
						            $(this).addClass('active').next().stop(true,true).slideDown('normal');
						        } else {
						            $(this).removeClass('active');
						            $(this).next().stop(true,true).slideUp('normal');
						        }
						    });
						
						});
					</script>
					<div class=" chain-grid menu-chain">
	   		     		<a href="single.html"><img class="img-responsive chain" src="<%=request.getContextPath()%>/static/images/wat.jpg" alt=" " /></a>	   		     		
	   		     		<div class="grid-chain-bottom chain-watch">
		   		     		<span class="actual dolor-left-grid">300$</span>
		   		     		<span class="reducedfrom">500$</span>  
		   		     		<h6>Lorem ipsum dolor</h6>  		     			   		     										
	   		     		</div>
	   		     	</div>
	   		     	 <a class="view-all all-product" href="product.html">VIEW ALL PRODUCTS<span> </span></a> 	
			</div>
<div class="clearfix"> </div>			
		</div>



<%@include file="common/footer.jsp"%>
</body>
</html>