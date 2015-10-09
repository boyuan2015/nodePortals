/***************************
*   VW Survey Create   *
***************************/
(function ($, VWSurveyCreateSchedule, undefined) {

    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idFormCreate: 'frmCreateSchedule',
        idBtnCreate: 'btnCreateSchedule',
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
                		VWUtility.errorToast( "Start date should less than end date." );
                		return;	
                	}
					
					settings.objLadda = Ladda.create($btn.get(0));
			        settings.objLadda.start();

                    addSchedule(form);
                }
            });
        });
        
    };
    //-->

	/** Create Question */
    var addSchedule = function(form){

        var options = {
            //data: { _method:"create" },
            success: function (responseText) {
            		
                if ((responseText != null) && (responseText.toLowerCase().indexOf('error') === -1)) {
					// Success!
					window.location.href = "/survey/schedule?status=scheduled";
                    
                } else if (responseText != null) {

                    // Error!
                    VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Could not schedule the Survey.');
                    VWUtility.resetLadda(settings.objLadda);
                    console.log('Error #1: ' + responseText);
                }
            },
            error: function () {
            	VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', 'Could not schedule the Survey.');
                VWUtility.resetLadda(settings.objLadda);
                console.log('Error #2');
            }
        };

        $(form).ajaxSubmit(options);
    };
    /** /Create Question */

    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {
		
		// TODO:
        bindForm();
        
        $('#liRestaurants, #liSelectedRestaurant, #liSurvey').addClass('open, active')
	        .find('ul:first').css('display', 'block');
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWSurveyCreateSchedule = window.VWSurveyCreateSchedule || {}));
