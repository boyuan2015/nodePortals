/***************************
*   VW Survey Create  	   *
***************************/
(function ($, VWSurveyCreate, undefined) {

    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idFormCreate: 'frmCreateSurvey',
        idBtnCreate: 'btnGotoComplete',
        idStartDatePickerControl: 'fixedStartDate',
        idEndDatePickerControl: 'fixedEndDate',
        idStartTimePickerControl: 'fixedStartTime',
        idEndTimePickerControl: 'fixedEndTime',
        objLadda: null
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

    /** Bind Form */
    var bindForm = function(){
		
		// Date picker
        var d = new Date();
        $( "#" + settings.idStartDatePickerControl ).val( ( d.getMonth() + 1 ) + "/" + d.getDate() + "/" + d.getFullYear() );
        $( "#" + settings.idEndDatePickerControl ).val( ( d.getMonth() + 1 ) + "/" + d.getDate() + "/" + d.getFullYear() );
        
        $( "#" + settings.idStartDatePickerControl ).datepicker();
        $( "#" + settings.idEndDatePickerControl ).datepicker();
        
        // Time picker
        $( "#" + settings.idStartTimePickerControl ).val( d.getHours() + ":" + d.getMinutes() + ":00" );
        $( "#" + settings.idEndTimePickerControl ).val( d.getHours() + ":" + d.getMinutes() + ":00" );
        
        $( '#' + settings.idStartTimePickerControl ).timepicker( {
            minuteStep: 1,
            appendWidgetTo: 'body',
            showSeconds: true,
            showMeridian: false,
            defaultTime: false
        } );
        
        $( '#fixedEndTime' ).timepicker( {
        	minuteStep: 1,
            appendWidgetTo: 'body',
            showSeconds: true,
            showMeridian: false,
            defaultTime: false
        } );
        
        // Button		
        $('#' + settings.idBtnCreate).click(function(){

			var $btn = $(this);

			$('#' + settings.idFormCreate).validate({
                submitHandler: function (form) {
					var start  = $( "#" + settings.idStartDatePickerControl ).val() + " " + $( "#" + settings.idStartTimePickerControl ).val();
                	var end    = $( "#" + settings.idEndDatePickerControl ).val() + " " + $( "#" + settings.idEndTimePickerControl ).val();
                	                	
                	var startDate = new Date( start );
                	var endDate   = new Date( end );
                	
                	if( endDate <= startDate )
                	{
                		VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Start date should less than end date.');
                		return;	
                	}

                    addSchedule(form);
                }
            });
        });
        
    };
    //-->

	/** Create Question */
    var addSchedule = function(form){

		var $btn = $('#' + settings.idBtnCreate);
		settings.objLadda = Ladda.create($btn.get(0));
		settings.objLadda.start();

        var options = {
            //data: { _method:"create" },
            success: function (responseText) {
            		
                if ((responseText != null) && (responseText.toLowerCase().indexOf('error') === -1)) {
					// Success!
					VWUtility.resetLadda(settings.objLadda);
					VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS, 'Success:', 'Created Survey.');
					window.location.href = "/survey/schedule?status=created";
                    
                } else if (responseText != null) {

                    // Error!
                    responseText = responseText.replace( 'ERROR: ' );
                    VWUtility.resetLadda(settings.objLadda);
                    VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', responseText);
                    console.log('Error #1: ' + responseText);
                }
            },
            error: function () {
            	VWUtility.resetLadda(settings.objLadda);
            	VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Could not create a new Survey.');
                console.log('Error #2');
            }
        };

        $(form).ajaxSubmit(options);
    };
    /** /Create Question */

	var updateStep = function (){
		// Progress Step
        VWSurveys.setStepEnableArrayValue("true");
        VWSurveys.setStepEnableArrayValue("true");
        VWSurveys.setCurrentStep(2);
        VWSurveys.setupComponents();
	}

    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {
		
		// TODO:
        bindForm();
        updateStep();
        $("svg").height(100);
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWVWSurveyCreate = window.VWVWSurveyCreate || {}));
