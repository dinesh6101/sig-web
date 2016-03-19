<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<div class="main-content-inner">
<div class="breadcrumbs" id="breadcrumbs">
	<script type="text/javascript">
		try{ace.settings.check('breadcrumbs' , 'fixed')}catch(e){}
	</script>

	<ul class="breadcrumb">
		<li>
			<i class="ace-icon fa fa-home home-icon"></i>
			<a href="#">Home</a>
		</li>

		<li>
			<a href="#">Setup New Test</a>
		</li>
		<li class="active">Add New Test</li>
	</ul><!-- /.breadcrumb -->

	<div class="nav-search" id="nav-search">
		<form class="form-search">
			<span class="input-icon">
				<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" />
				<i class="ace-icon fa fa-search nav-search-icon"></i>
			</span>
		</form>
	</div><!-- /.nav-search -->
</div>

<div class="page-content">
	<div class="page-header">
		<h1>
			Setup Test
			<!-- <small>
				<i class="ace-icon fa fa-angle-double-right"></i>
				Common form elements and layouts
			</small> -->
		</h1>
	</div><!-- /.page-header -->

<div class="row">
	<div class="col-xs-12">
	<!-- PAGE CONTENT BEGINS -->
		
    <form class="form-horizontal" role="form">
    		  
		<label class="col-sm-1 control-label no-padding-right" for="form-field-1"> 
		      Select Test 
		</label>		
		
		<div class="col-sm-9">
		
		<select data-ng-model="exam.selectedObject" >
			<option data-ng-repeat="option in exam.availableOptions"
                    value="{{option.id}}">{{option.examName}}</option>
		</select>
		
		{{exam.selectedObject}}
		
	    </div>	
     	
			<div class="btn-group">
			<span class="inline pull-right">
					<button data-toggle="dropdown"
								class="btn btn-warning dropdown-toggle" aria-expanded="false">
								Add Question <span
									class="ace-icon fa fa-caret-down icon-on-right"></span>
					</button>
							
							<ul class="dropdown-menu dropdown-warning">
								<li><button ng-click="addNewQuestionBtn()" ng-model="addQuestionBtnValue">Add New Question</button></li>

								<li><button ng-click="importQuestionBtn()" ng-model="importQuestionBtnValue">Import Question</button></li>

								<li><button ng-click="selectQuestionBankBtn()" ng-model="selectQuestionBankBtnValue">Select from Question Bank</button></li>

							</ul></span>
						</div> 
			
		<div class="space-4"></div>	
		
		<div ng-show = "addQuestionBtnValue" > 
	    <%@ include file="question-type-component.jsp" %>
	    </div>
	    
	    <div ng-show = "importQuestionBtnValue" > 
	    import file component........
	    </div>
	    
	    <div ng-show = "selectQuestionBankBtnValue" > 
	    select questions from question bank.........
	    </div>
		
	</form>
    </div>
</div><!-- /.page-content -->
</div>
</div>
		