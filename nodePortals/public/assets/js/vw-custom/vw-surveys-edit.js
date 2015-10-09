/***************************
*   VW Survey Edit   *
***************************/
(function ($, VWSurveyEdit, undefined) {

    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idFormCreate: 'frmEditSurvey',
        idBtnCreate: 'btnUpdate',
        idBtnCreateQuestion: 'btnAddQuestion',
        idFormCreateQuestion: 'frmAddQuestion',
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
    
	var updateQuestionsToDisplay = function () {
		$( '#ddlQuestionDisplay' ).find( 'option' ).remove();
		
		var total = 0;
		
		var elements = $( '#collapseinSurvey' ).children();
		for ( var index = 0; index < elements.length; index++ )
		{
			$obj = $( elements[index] );
			if ( $obj.is( 'div' ) && $obj.hasClass( 'survey-div-body' ) )
			{
				total++;
			}
		}
		
		for ( var index = 1; ( index <= total ) && ( index <= 4 ); index++ )
		{
			if ( ( index == total ) || ( index == 4 ) )
			{
				$( '#ddlQuestionDisplay' ).append( '<option value="' + index + '" selected>' + index );
			}
			else
			{
				$( '#ddlQuestionDisplay' ).append( '<option value="' + index + '">' + index );
			}
		}
	}
	
	var updateCheckedQuestions = function ()
	{
		var chks = $( '#collapseinSurvey' ).find( 'input:checkbox' );
		
		var ids = [];
		for ( var index = 0; index < chks.length; index++ )
		{
			ids.push( $( chks[ index ] ).val() );
		}
		$( '#hidCheckedQuestionIds' ).val( ids.join() );
	}
    
    /** Bind Form */
    var bindFixedForm = function(){
				
        $('#' + settings.idBtnCreate).click(function(){
			$('#' + settings.idFormCreate).validate({
                submitHandler: function (form) {
                						
					updateSurvey( form );
                }
            });
        });
        
    };
    
    var bindRotatingForm = function(){
				
        $('#' + settings.idBtnCreate).click(function(){

			$('#' + settings.idFormCreate).validate({
                submitHandler: function (form) {
					
					updateSurvey( form );
                }
            });
        });
        
    };
    
    var bindAddQuestionForm = function(){
    	resetCustomValidators();
				
        $('#' + settings.idBtnCreateQuestion).click(function(){

			var $btn = $(this);

			var inputs = getAllChoiceInput();

			var choicesToValidate = {};
			for( var index = 0; index < inputs.length; index++ )
			{
				var input = inputs[ index ];
	           	choicesToValidate[ input.id ] = { validateNumberOfChoices: true };
	           	//choicesToValidate[ $("#divChoices").children()[index].id ] = { validateNumberOfChoices: true, validateDuplicatedOfChoices: true };
	        }
	
			$('#' + settings.idFormCreateQuestion).validate({
				rules: choicesToValidate,
	            submitHandler: function (form) {
	            	
	            	var text = $("#txtQuestionText").val();
					var type = $("#selQuestionType").val();
	            	var choices = getAllChoices();
	            		                
	                addQuestion(form, text, type, choices);
	            }
	        });
        });
    }
    //-->
    
    /** Create Question */
    var addQuestion = function(form, text, type, choices){
		
		var $btn = $('#' + settings.idBtnCreateQuestion);
		
		settings.objLadda = Ladda.create($btn.get(0));
        settings.objLadda.start();
		
        var options = {
            //data: { _method:"create" },
            success: function (responseText) {
            		
            	if ((responseText != null) && (responseText.toLowerCase().indexOf('error') === -1)) {
					// Success!
					VWSurveyEdit.addQuestionToList(text, type, choices, responseText)
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
    
    var updateSurvey = function(form){
		
		$btn = $('#' + settings.idBtnCreate);
		settings.objLadda = Ladda.create($btn.get(0));
		settings.objLadda.start();
			        
        var options = {
            success: function (responseText) {
            		
                if ((responseText != null) && (responseText.toLowerCase().indexOf('error') === -1)) {
					// Success!
					if ( location.href.indexOf( 'page=scheduled' ) > -1 )
					{
						location.href = "/survey/schedule?status=edited";
					}
					else if ( location.href.indexOf( 'page=restaurant' ) > -1 )
					{
						location.href = "/survey/surveylist?status=edited";
					}
					else
					{
						location.href = "/survey?status=edited";
					}
                    
                } else if (responseText != null) {
                    // Error!
                    responseText = responseText.replace( 'ERROR: ', '' );
                    VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', responseText);
                    VWUtility.resetLadda(settings.objLadda);
                    console.log('Error #1');
                }
            },
            error: function () {
            	VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Could not edit the Survey.');
            	VWUtility.resetLadda(settings.objLadda);
                console.log('Error #2');
            }
        };
		
		updateCheckedQuestions();
		
      	$(form).ajaxSubmit(options);
    };
    
    VWSurveyEdit.onAddAnotherQuestionClick = function ()
	{
		$("#aAddAnotherQuestion").hide();
	  	$("#divAddQuestionPanel").show("blind", 300);
	}
    
    VWSurveyEdit.onAddAnotherChoiceClick = function ()
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
					         '<button class="btn btn-default btn-delete-rf-id-tag vw-tooltip" type="button" data-toggle="tooltip" data-placement="top" title="Delete this choice" data-rf-id="3" onclick="VWSurveyEdit.removeChoice(' + newId +')">' +
					            '<i class="fa fa-times"></i>' +
					         '</button>' +
					    '</span>' +
					'</div>';
		}
	   		
		$( "#divChoices" ).append( html );
	}
	
	VWSurveyEdit.removeChoice = function ( index )
	{
		$( '#divChoice' + index ).remove();
	}
	
	VWSurveyEdit.resetAddAnotherQuestionView = function ()
	{
		$("#txtQuestionText").val("");
		$("#selQuestionType").val("RADIO");
		$("#divChoices").empty();
		$("#aAddMoreChoice").show();
		VWSurveyEdit.onAddAnotherChoiceClick();	// first choice
		VWSurveyEdit.onAddAnotherChoiceClick();	// second choice
		
		$("#aAddAnotherQuestion").show("blind", 300);
		$("#divAddQuestionPanel").hide("blind", 300);
	}
		
	VWSurveyEdit.addQuestionToList = function (text, type, choices, id)
	{
		id = id.trim();
	
		var choice = "<ul>";
		choices.forEach( function(element) {
			choice += '<li>' + element + '</li>';
		} );
		choice += "<ul>"
		
		var attr = "";
		if ( $('#hidSurveyType').val() != 'UX' )
		{
			attr += " disabled";
		}
		var html = '<div id="divQuestion' + id + '" class="survey-div-body">' +
						'<div class="row" style="margin-top: 1em;">' +
							'<div class="col-sm-10">' +
                            	'<input id="checkQuestion[]" name="checkQuestion[]" type="checkbox" value="' + id + '" ' + attr + ' class="checkbox-inline hidden">&nbsp;&nbsp;' + text +
                            '</div>' +
							'<div class="col-sm-2" style="padding-right: 30px; text-align: right;">' +
								'<a href="javascript:;" class="btn btn-default btn-xs ladda-button" data-style="contract" onclick="VWSurveyEdit.deleteQuestion(' + id + ', this)">Delete</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<div class="col-sm-6">' + 
                               	choice +
                            '</div>' +
                        '</div>' +
                    '</div>';                    		

		$( "<hr/>" ).insertBefore( "#divAddQuestionPanel" );
		$( html ).insertBefore( "#divAddQuestionPanel" );	

		VWSurveyEdit.resetAddAnotherQuestionView();
		
		updateQuestionsToDisplay();
		
		// store in hidden field
		var ids = $( '#hidQuestionIds' ).val();
		if ( ids.length == 0 )
		{
			ids = id;
		}
		else
		{
			ids += "," + id;
		}
		$( '#hidQuestionIds' ).val( ids );
	};
    
    VWSurveyEdit.deleteQuestion = function ( id, btn )
    {
    	$btn = $( btn );
            	
    	settings.objLadda = Ladda.create($btn.get(0));
        settings.objLadda.start();
        
        $.ajax( {
    	 	url: "/survey/" + id + "/detroyNewQuestion",
    	 	success: function( result ) {
    	 	    	 	
    	 		VWUtility.resetLadda(settings.objLadda);
    	 		
    	 		if( result.indexOf('error') === -1 )
    	 		{
    	 			// success
    	 			VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS, 'Success:', "Delete question.");
    	 			    	 			
    	 			// Remove div
    	 			var divs = $( '#collapseinSurvey' ).find( 'div#divQuestion' + id );
			    	var $div = $( divs[0] );
			    	
			    	var $next = $div.next();
			    	if ( $next.is( 'hr' ) )
			    	{
			    		$next.remove();
			    	}
			    	else
			    	{
			    		var $prev = $div.prev();
			    		if ( $prev.is( 'hr' ) )
			    		{
			    			$prev.remove();
			    		}
			    	}
			    	$div.remove();
			    	
			    	// update ids in hidden
			    	var ids = $( '#hidQuestionIds' ).val();
			    	var idArray = ids.split( ',' );
			    	idArray.splice( idArray.indexOf( id ), 1 );
			    	ids = idArray.join();
			    	$( '#hidQuestionIds' ).val( ids );
			    	
			    	updateQuestionsToDisplay();
    	 		}
			    else
			    {
			    	// error
			    	console.log( result );
			    }
  			}
		});
    }
    
    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {
		
		if ( $('#hidSurveyType').val() == 'UX' )
		{
			bindFixedForm();
		}
		else
		{
			bindRotatingForm();
		}
		
		updateCheckedQuestions();
		
		bindAddQuestionForm();
		
		$("#aAddAnotherQuestion").show();
	  	$("#divAddQuestionPanel").hide();
		
		$('#liRestaurants, #liSelectedRestaurant, #liSurvey').addClass('open, active')
	        .find('ul:first').css('display', 'block');
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWSurveyEdit = window.VWSurveyEdit || {}));
