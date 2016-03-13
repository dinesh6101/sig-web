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
<script>
	var grocerycategoryid = <%=request.getAttribute("grocerycategoryid")%>
	var itemcategoryid = <%=request.getAttribute("itemcategoryid")%>
</script>

	<div data-ng-app="grosaryMenu" ng-controller="grosaryMenuController" class="container">

	<div class="women-product">
		<div class=" w_content">
			<div class="women">
				<a href="#"><h4>Enthuware - <span>4449 items</span> </h4></a>
				<ul class="w_nav">
					<li>Sort : </li>
			     	<li><a class="active" href="#">popular</a></li> |
			     	<li><a href="#">new </a></li> |
			     	<li><a href="#">discount</a></li> |
			     	<li><a href="#">price: Low High </a></li> 
			     <div class="clearfix"> </div>	
			     </ul>
			     <div class="clearfix"> </div>	
			</div>
		</div>
		
		
		<!-- grids_of_4 -->
		<div class="grid-product">
             <div class="product-grid" data-ng-repeat="itemsWithImageList in itemsWithImageList.availableOptions" >
             	<div class="content_box">
             		<div class="left-grid-view grid-view-left"><a href="<%=request.getContextPath()%>{{itemsWithImageList.url}}">
	             		<img src="<%=request.getContextPath()%>/static/images/pic13.jpg" class="img-responsive watch-right" alt="">
				   	   	<div class="mask">
	                        <div class="info">Quick View</div>
			            </div>
				   	  </a>
					</div>
					<h4><a href="#"> {{itemsWithImageList.itemname}} </a></h4>
			     	<p>It is a long established fact that a reader</p>
			     	Rs. {{itemsWithImageList.cost}}
		   		</div>
            </div>
			<div class="clearfix"> </div>
		</div>
	</div>

		<div class="sub-cate">
			<div class=" top-nav rsidebar span_1_of_left"
				data-ng-element-ready="init(<%=request.getAttribute("x.grocerycategoryid")%>,<%=request.getAttribute("x1.itemcategoryid")%>)">
				<h3 class="cate">CATEGORIES</h3>
				<ul class="menu">
					<li ng-repeat="x in dataGroceryDropDown.availableOptions"><a href={{removespaceGrocery(x.grocerycategoryname)}}>{{x.grocerycategoryname}}{{itemCount.availableOptions.count}}<img
							class="arrow-img" src="<%=request.getContextPath()%>/static/images/arrow1.png" alt="" /></a>
						<ul>
							<li ng-if="x1.grocerycategoryid == x.grocerycategoryid" ng-repeat="x1 in dataItemCatDropDown.availableOptions">
								<ul class="show_hide">
								  <li><a href=<%=request.getContextPath()%>/{{removespaceItemCategory(x1.itemcategoryname)}}> {{x1.itemcategoryname}}</a> 
									  <!--  <ul> 
                                      <li  ng-if="x2.itemcategoryid == x1.itemcategoryid" ng-repeat="x2 in item.availableOptions"><a href="">{{x2.itemname}}</a>
                                      </ul>  -->
								</ul>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<div class=" chain-grid menu-chain">
				<a href="items.jsp">
					<img class="img-responsive chain" src="<%=request.getContextPath()%>/static/images/wat.jpg" alt=" " /></a>
				<div class="grid-chain-bottom chain-watch">
					<span class="actual dolor-left-grid">300$</span> <span
						class="reducedfrom">500$</span>
					<h6>
						<a href="items.jsp">Lorem ipsum dolor</a>
					</h6>
				</div>
			</div>
			<a class="view-all all-product" href="product.html">VIEW ALL PRODUCTS<span> </span>
			</a>
		</div>
		<div class="clearfix"></div>
	</div>

	<%@include file="common/footer.jsp"%>
	
</body>
</html>