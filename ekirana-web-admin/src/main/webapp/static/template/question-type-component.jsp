<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<!-- <script>
	$(document).ready(function() {

		$("#multipleChoiceBtn").click(function() {
			$("multipleChoiceDiv").show();
		});
		$("#freeTextBtn").click(function() {
			$("freeTextDiv").show();
		});
	});
</script> -->
<body>
	<table>
		<tr>
			<td>
				<button class="btn btn-warning btn-xlg" value="multipleChoiceBtn"
					data-ng-click="changeOnMcq()">Multiple Choice</button>
				<button class="btn btn-warning btn-xlg" value="trueFalseBtn"
					data-ng-click="changeOnTrueFalse()">True False</button>
				<button class="btn btn-warning btn-xlg" value="freeTextBtn"
					data-ng-click="changeOnFreeText()">Free Text</button>
				<button class="btn btn-warning btn-xlg" value="essayBtn"
					data-ng-click="changeOnEssay()">Essay</button></td>
		</tr>

		<tr>
			<td>
				<div id="freeTextDiv" data-ng-show="freeTextBtnValue">
					<label for="form-field-11">Question</label>
					<textarea id="form-field-11"
						class="autosize-transition form-control"
						style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 52px;"
						data-ng-model="setupPaperForFreeText.question">
	                </textarea>

					<label for="form-field-11">Answer</label>
					<textarea id="form-field-11"
						class="autosize-transition form-control"
						style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 52px;"
						data-ng-model="setupPaperForFreeText.answer">
	                </textarea>

					<div class="space-4"></div>

					<button class="btn btn-warning btn-xlg"
						data-ng-click="saveFreeTextQuestion()">
						<i class="ace-icon fa fa-check bigger-110"></i> Save Question
					</button>
					&nbsp; &nbsp; &nbsp;
					<button class="btn btn-warning btn-xlg" type="reset">
						<i class="ace-icon fa fa-undo bigger-110"></i> Reset
					</button>

				</div>

				<div id="multipleChoiceDiv" data-ng-show="multipleChoiceBtnValue">

					<label for="form-field-11">Question</label>
					<textarea id="form-field-11" data-ng-model="setupPaper.question"
						class="autosize-transition form-control"
						style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 52px;">
	                </textarea>


					<label for="form-field-11">Answer</label>
					<div data-ng-repeat="object in setupPaper.options">
						<div class="checkbox">
							<label> <input name="form-field-checkbox" type="checkbox"
								data-ng-model="object.isCorrect"
								data-ng-value={{object.isCorrect}} class="ace"> <span
								class="lbl"> </span> </label>

							<textarea id="form-field-11" data-ng-model="object.text"
								class="autosize-transition form-control"
								style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 52px;">
	                            </textarea>
						</div>
					</div>
					<div class="space-4"></div>

					<button class="btn btn-warning btn-xlg"
						data-ng-click="saveObjectiveQuestion()">
						<i class="ace-icon fa fa-check bigger-110"></i> Save Question
					</button>
					&nbsp; &nbsp; &nbsp;
					<button class="btn btn-warning btn-xlg" type="reset">
						<i class="ace-icon fa fa-undo bigger-110"></i> Reset
					</button>


				</div>


				<div id="trueFalseDiv" data-ng-show="trueFalseBtnValue">
					<label for="form-field-11">Question</label>
					<textarea id="form-field-11"
						class="autosize-transition form-control"
						style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 52px;">
	                </textarea>
					<label for="form-field-11">Answer</label>
					<div class="radio">
						<label> <input name="form-field-radio" type="radio"
							class="ace"> <span class="lbl"> True</span> </label>

					</div>
					<div class="radio">
						<label> <input name="form-field-radio" type="radio"
							class="ace"> <span class="lbl"> False </span> </label>

						<div class="space-4"></div>

						<button class="btn btn-warning btn-xlg"
							data-ng-click="saveObjectiveQuestion()">
							<i class="ace-icon fa fa-check bigger-110"></i> Save Question
						</button>
						&nbsp; &nbsp; &nbsp;
						<button class="btn btn-warning btn-xlg" type="reset">
							<i class="ace-icon fa fa-undo bigger-110"></i> Reset
						</button>

					</div>
				</div>

				<div id="essayDiv" data-ng-show="essayBtnValue">
					<label for="form-field-11">Question</label>
					<textarea id="form-field-11"
						class="autosize-transition form-control"
						style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 52px;">
	                </textarea>
					<label for="form-field-11">Answer</label>
					<div class="wysiwyg-editor" id="editor1" contenteditable="true"></div>

					<div class="space-4"></div>

					<button class="btn btn-warning btn-xlg"
						data-ng-click="saveQuestion()">
						<i class="ace-icon fa fa-check bigger-110"></i> Save Question
					</button>
					&nbsp; &nbsp; &nbsp;
					<button class="btn btn-warning btn-xlg" type="reset">
						<i class="ace-icon fa fa-undo bigger-110"></i> Reset
					</button>

				</div></td>
		</tr>
	</table>
</body>
</html>