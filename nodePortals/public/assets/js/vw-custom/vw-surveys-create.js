/***************************
*   VW Survey Create       *
***************************/
(function ($, VWSurveyCreate, undefined) {

    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idFormCreate: 'frmAddQuestion',
        idBtnCreate: 'btnAddQuestion',
        idBtnNext: 'btnGotoStep2',
        objLadda: null
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

	var getAllChoiceInput = function () {
		var allInputs = $( ":input" );
		var inputs = [];		
		for( var index = 0; index < allInputs.length; index++ )
		{
			var element = allInputs[index];
			if ( element.id != undefined && element.id.indexOf( 'txtQuestionChoice' ) != -1 && element.id.indexOf( '-error' ) == -1 )
				inputs.push( element );
		}
		return inputs;
	}

	var getAllChoices = function () {
		var inputs = getAllChoiceInput();
		var choices = [];
		for( var index = 0; index < inputs.length; index++ )
        {
        	var input = inputs[ index ];
        	var val = $( input ).val();
           	if( val != "" )
           		choices.push( val );
        }
        return choices;
	}
	
	var resetCustomValidators = function () {
		// Custom validator for number choices
		$.validator.addMethod( "validateNumberOfChoices", function(value, element) {
			var choices = getAllChoices();
			
            // check number of choice must be >= 2
            if ( choices.length < 2 )
              	return false;
                    
  			return true;
		}, "Require at least 2 choices" );
		
		// Custom validator for duplicated choices
		$.validator.addMethod( "validateDuplicatedOfChoices", function(value, element) {
			var choices = getAllChoices();
			              	
            // check duplicate choice text
			var sortedChoices = choices.sort();
			for (var i = 0; i < sortedChoices.length - 1; i++) {
			    if (sortedChoices[i + 1] == sortedChoices[i]) {
			        return false;
			    }
			}
                    
  			return true;
		}, "There are some duplicated choices" );
	}

    /** Bind Form */
    var bindForm = function(){
		
		resetCustomValidators();
		
        $('#' + settings.idBtnCreate).click(function(){

			var $btn = $(this);

			var inputs = getAllChoiceInput();

			var choicesToValidate = {};
			for( var index = 0; index < inputs.length; index++ )
			{
				var input = inputs[ index ];
	           	choicesToValidate[ input.id ] = { validateNumberOfChoices: true };
	           	//choicesToValidate[ $("#divChoices").children()[index].id ] = { validateNumberOfChoices: true, validateDuplicatedOfChoices: true };
	        }
	
			$('#' + settings.idFormCreate).validate({
				rules: choicesToValidate,
	            submitHandler: function (form) {
	            	
	            	var text = $("#txtQuestionText").val();
					var type = $("#selQuestionType").val();
	            	var choices = getAllChoices();
	            		                
	                addQuestion(form, text, type, choices);
	            }
	        });
        });
        
    };
    //-->

	var updateStep = function (){
		// Progress Step
        VWSurveys.setCurrentStep(0);
        VWSurveys.setupComponents();
	}

	/** Create Question */
    var addQuestion = function(form, text, type, choices){
		
		var $btn = $('#' + settings.idBtnCreate);
		
		settings.objLadda = Ladda.create($btn.get(0));
        settings.objLadda.start();
		
        var options = {
            //data: { _method:"create" },
            success: function (responseText) {
            		
            	if ((responseText != null) && (responseText.toLowerCase().indexOf('error') === -1)) {
					// Success!
					VWSurveyCreate.addQuestionToList(text, type, choices)
					VWUtility.resetLadda(settings.objLadda);
					VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS, 'Success:', 'Added a new Question.');
					
                } else if (responseText != null) {
					// Error!
					VWUtility.resetLadda(settings.objLadda);
       	            VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Could not add a new Question.');
           	        console.log('Error #1');
                }
            },
            error: function () {
            	VWUtility.resetLadda(settings.objLadda);
            	VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Could not add a new Question.');
                console.log('Error #2');
            }
        };

        $(form).ajaxSubmit(options);
    };
    /** /Create Question */

	VWSurveyCreate.onBtnStep2Click = function ()
	{	
		if( $("#accordioninPanelAddQuestion").children().length == 0 )
		{
			VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Require at least 1 question');
			return;
		}
		
		var $btn = $( '#' + settings.idBtnNext );
		
		settings.objLadda = Ladda.create($btn.get(0));
        settings.objLadda.start();
		
	    window.location.href ="/survey/create?step=2";
	}
	
	
	VWSurveyCreate.onAddAnotherQuestionClick = function ()
	{
		$("#aAddAnotherQuestion").hide();
	  	$("#divAddAnotherQuestion").show("blind", 300);
	}
	   
	VWSurveyCreate.onAddAnotherChoiceClick = function ()
	{
		var allInputs = getAllChoiceInput();
		var newId = 1;
		var maxId = 0;
		
		for( var index = 0; index < allInputs.length; index++ )
        {
        	var input = allInputs[ index ];
        	var id = parseInt( input.id.replace( "txtQuestionChoice", "" ) );
        	if ( id > maxId )
        		maxId = id;
        }
        newId += maxId;
		
		var html = "";
		
		if ( newId <= 2 )
		{
			// the 1st and 2nd choice that are required
			html = '<div class="input-group">' +
				  		'<input type="text" class="form-control" style="width: 418px" id="txtQuestionChoice'+newId+'" name="txtQuestionChoice'+newId+'" placeholder="choice '+newId+ '">' +
				   '</div>';
		}
		else
		{
			html = '<div class="input-group" id="divChoice' + newId +'">' +
					    '<input type="text" class="form-control" id="txtQuestionChoice' + newId +'" name="txtQuestionChoice' + newId +'" placeholder="choice ' + newId +'">' +
					    '<span class="input-group-btn" style="vertical-align: top;">' +
					         '<button class="btn btn-default btn-delete-rf-id-tag vw-tooltip" type="button" data-toggle="tooltip" data-placement="top" title="Delete this choice" data-rf-id="3" onclick="VWSurveyCreate.removeChoice(' + newId +')">' +
					            '<i class="fa fa-times"></i>' +
					         '</button>' +
					    '</span>' +
					'</div>';
		}
	   		
		$( "#divChoices" ).append( html );
	}
	
	VWSurveyCreate.removeChoice = function ( index )
	{
		$( '#divChoice' + index ).remove();
	}
	
	VWSurveyCreate.resetAddAnotherQuestionView = function ()
	{
		$("#txtQuestionText").val("");
		$("#selQuestionType").val("RADIO");
		$("#divChoices").empty();
		$("#aAddMoreChoice").show();
		VWSurveyCreate.onAddAnotherChoiceClick();	// first choice
		VWSurveyCreate.onAddAnotherChoiceClick();	// second choice
		
		$("#aAddAnotherQuestion").show("blind", 300);
		$("#divAddAnotherQuestion").hide("blind", 300);
	}
		
	VWSurveyCreate.addQuestionToList = function (text, type, choices)
	{
		// Choices
		var choiceString = "<ul>";
		choices.forEach( function( entry ) {
			choiceString += "<li>" + entry + "</li>"
		} );
	    choiceString += "</ul>";
		
		var newId = $("#accordioninPanelAddQuestion").children().length + 1;
		
		var html  = "<div class=\"accordion-item collapse.in\">";
	 	html     += "    <a class=\"accordion-title\" data-toggle=\"collapse\" data-parent=\"#accordioninPanelAddQuestion\" href=\"#collapseinDemoQuestion" + newId + "\"><h4>" + text + "</h4></a>";
	    html     += "    <div id=\"collapseinDemoQuestion" + newId + "\" class=\"collapse\">";
	    html     += "        <div class=\"accordion-body\">";
	    html     += "            <div class=\"form-group\" style=\"margin-bottom: 0px;\">";
	    html     += choiceString;
	    html     += "            </div>";
		html     += "        </div>";
	    html     += "    </div>";
	    html     += "</div>";
		
		$("#accordioninPanelAddQuestion").append( html );
		
		VWSurveyCreate.resetAddAnotherQuestionView();
	};

    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {
		
		// TODO:
        bindForm();
        
        if ( $( '#accordioninPanelAddQuestion' ).children().length == 0 )
        {
        	$("#aAddAnotherQuestion").hide();
			$("#divAddAnotherQuestion").show();
        }
        else
        {
        	$("#aAddAnotherQuestion").show();
			$("#divAddAnotherQuestion").hide();
		}
	
        updateStep();
        
        $("svg").height(100);
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWSurveyCreate = window.VWSurveyCreate || {}));

