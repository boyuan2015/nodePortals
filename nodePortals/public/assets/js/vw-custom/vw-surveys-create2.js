/***************************
*   VW Survey Create       *
***************************/
(function ($, VWSurveyCreate, undefined) {

    /*** GLOBALS ***/
    
    /* Settings */
    var settings1 = {
        idFormCreate: 'frmCreateFixedSurvey',
        idBtnCreate: 'btnGotoStep3',
        objLadda: null
    };
    
    var settings2 = {
        idFormCreate: 'frmCreateRotatingSurvey',
        idBtnCreate: 'btnRotatingGotoStep3',
        objLadda: null
    };
    
    /* /Settings */


    /*** PRIVATE METHODS ***/

    /** Bind Form */
    var bindForm1 = function(){
				
        $('#' + settings1.idBtnCreate).click(function(){
					
			var $btn = $(this);

			$('#' + settings1.idFormCreate).validate({
				
                submitHandler: function (form) {
                										
					settings1.objLadda = Ladda.create($btn.get(0));
			        settings1.objLadda.start();
			        
			        $('#' + settings1.idFormCreate).unbind().submit(); 
					$('#' + settings1.idFormCreate).submit();
                }
            });
        });
    };
    
    var bindForm2 = function(){
				
        $('#' + settings2.idBtnCreate).click(function(){

			var $btn = $(this);

			$('#' + settings2.idFormCreate).validate({
                submitHandler: function (form) {
					
					settings2.objLadda = Ladda.create($btn.get(0));
			        settings2.objLadda.start();
					
					$('#' + settings2.idFormCreate).unbind().submit(); 
					$('#' + settings2.idFormCreate).submit();
                }
            });
        });
        
    };
    
    var updateStep = function (){
    	// Progress Step
    	VWSurveys.setStepEnableArrayValue("true");
        VWSurveys.setCurrentStep(1);
        VWSurveys.setupComponents();
    }
    //-->
    
    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {
		
		// TODO:
        bindForm1();
        bindForm2();
        updateStep();
        $("svg").height(100);
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWSurveyCreate = window.VWSurveyCreate || {}));
