  		$(document).ready(function(){
 			$("#j_username").focus();
 			$("#j_username").bind('keypress', function(e){if(e.keyCode==13){$( '#goButton' ).click ();}});
 			$("#j_password").bind('keypress', function(e){if(e.keyCode==13){$( '#goButton' ).click ();}});
		});
  		
  		locateHomePage = function (){
  			window.location.replace('home.html');
    	}
  		
    	validateAndAuthenticate = function(type){
    		if(type=='ajax'){
	 			if($.trim($("#j_username").val())==""){
					alert('Please enter username');
					$("#j_username").focus();
				}
				else if($.trim($("#j_password").val())==""){
					alert('Please enter password');
					$("#j_password").focus();
				}else if($.trim($("#language").val())=="-1"){
					alert('Please select a language from the list');
					$("#language").focus();
				}else{
					 $.ajax({
						 	'type': 'POST',
					        'async': true,
					        'global': false,
					        'url': '../rest/login',
					        'dataType': "json",
					        'data':{
					        	"j_username": $.trim($("#j_username").val()),
					        	"j_password": $.trim($("#j_password").val()),
					        	"language": $.trim($("#language").val())
					        },
					        'success': function (restResponse, statuscode, xhr) {
					        	//alert("Login successful- USER CLASS: "+restResponse.data.userClass.classType);
					        	//locateHomePage(restResponse.data.userClass.classType);
					        	locateHomePage();
					        },
					        'error': function (xhr,code,errorText) {
					        	var errorResponse = $.parseJSON(xhr.responseText);
					        	var error = errorResponse.errors[0];
					            alert("Error code: "+error.errorCode+", Error type: "+error.errorType+", Message: "+error.errorMessage); 
					        }
					    });
				}
    		}else{
	 			if($.trim($("#j_username").val())==""){
					alert('Please enter username');
					$("#j_username").focus();
				}
				else if($.trim($("#j_password").val())==""){
					alert('Please enter password');
					$("#j_password").focus();
				}else if($.trim($("#language").val())=="-1"){
					alert('Please select a language from the list');
					$("#language").focus();
				}else{
					$("#login_form").submit();
				}
    		}
 		};
 		
 		showForgotPassword = function(){
 			$('#loginDiv').hide('fast');
			 $("#fp_username").attr("disabled",false);
			 $("#fp_username_submit").attr("disabled",false);
			 $('#forgotPasswordMessage').html("");
			 $("#fp_username").val('');
			 $('#resetPwdDiv').show('fast'); 
 		}
 		
 		closeForgotPassword = function(){
 			$('#forgotPasswordOverlay').hide('slow');
 		}
 		
 		sendRestPasswordRequest = function(){
 			if($.trim($("#fp_username").val())==""){
 				$('#forgotPasswordMessage').html('Please enter username.');
				$("#fp_username").focus();
			}else{
				 $("#fp_username").attr("disabled","disabled");
				 $("#fp_username_submit").attr("disabled","disabled");
				 $.ajax({
					 	'type': 'POST',
				        'async': true,
				        'global': false,
				        'url': '../rest/user/requestresetpassword',
				        'dataType': "json",
				        'data':{
				        	"userName": $.trim($("#fp_username").val())
				        },
				        'success': function (restResponse, statuscode, xhr) {
				        	$('#forgotPasswordMessage').html('A reset password email sent to your mail address, <br/>please follow the steps in the email.');
				        },
				        'error': function (xhr,code,errorText) {
				        	//alert(xhr.responseText);
				        	var errorResponse = $.parseJSON(xhr.responseText);
				        	var error = errorResponse.errors[0];
				        	$('#forgotPasswordMessage').html(error.i18nMessageKey);
				        }
				    });
			}
 		}
 		
