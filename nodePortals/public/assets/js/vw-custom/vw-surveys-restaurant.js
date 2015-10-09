/************************
*   Track Trace Show    *
************************/
(function ($, VWSurveys, undefined) {

    /*** GLOBALS ***/

    /* Settings */
    var settings = {
    	idDtSurvey: 'dt-survey',
        idxCurrentStep: -1,
        classTable: 'table',
        classPanelStep: 'panel-step-details',
        classStepProgressBar: 'step-status-progress-bar',
        classContainerDataTable: 'container-data-table',
        tmrThrottle: 250,
        blAesFiledValid: false,
        blIsfFiledValid: false,
        lblHtml: '<label style="font-size: 1.2em;"><i class="fa $$ fa-2x"></i></label>',
        arrStepDates: [],
        arrStepEnable: [],
        radStepCircle: 28,
        iStepLabelOffset: 55,
        messageTitle: '<strong>Survey</strong><br />',
        objSpinner: null,
        objLadda: null,
        intSpinnerRemoveDelay: 1000
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

	/** Bind DataTables */
    var bindDataTables = function() {

        if($('#' + settings.idDtSurvey).length){

            // Loading Spinner
            settings.objSpinner = VWUtility.createSpinner('.' + settings.classContainerDataTable);

            // DataTable
            var $oTable = $('#' + settings.idDtSurvey);
            $oTable.dataTable({
                'aaSorting': [[0, 'asc']],
                'aoColumns': [
                    null,
                    null,
                    { 'bSortable': false }
                ],
                'initComplete': function(tblSettings, tblJson) {
                    setTimeout(function(){

                        // Loading Spinner remove & show data-table
                        VWUtility.resetSpinner(settings.objSpinner);
                        $('.' + settings.classContainerDataTable).css('visibility', 'visible');
                    }, settings.intSpinnerRemoveDelay);
                }
            });

            // Row Expand or Collapse
            $oTable.find('.' + settings.classAExpand).on({
                click: function(){
                    handleRestaurantsRowExpandOrCollapse(this, $oTable);
                }
            });
        }else{
            $('.' + settings.classContainerDataTable).css('visibility', 'visible');
        }

    };
    /** /Bind DataTables */

    var addStep = function ($progressBar,id, icon, labelTxt, isEnable) {

        var label = labelTxt;
        $progressBar.addStep(label,id, settings.lblHtml.replace('$$', icon), isEnable);
    };

    /** Setup Progress Step */
    var setupProgressStep = function () {

        var $progressDiv = $('.' + settings.classStepProgressBar);
        $progressDiv.empty();
        var index = settings.idxCurrentStep;
        var lblHtml = settings.lblHtml;
        $.fn.progressStep.defaults.radius = settings.radStepCircle;
        $.fn.progressStep.defaults.labelOffset = settings.iStepLabelOffset;
        var $progressBar = $progressDiv.progressStep({ 'font-size': 12 });

        addStep($progressBar,"createStep1", 'fa-book', 'Questions', settings.arrStepEnable[0]);
        addStep($progressBar,"createStep2", 'fa-thumbs-up', 'Survey', settings.arrStepEnable[1]);
        addStep($progressBar,"createStep3", 'fa-star', 'Schedule', settings.arrStepEnable[2]);
        
        if (index >= 0) $progressBar.setCurrentStep(index);
        $progressBar.refreshLayout();
    };
    /** /Setup Progress Step */
    

    /*** PUBLIC PROPERTIES ***/
    
    /** Set Step Dates Array */
    VWSurveys.setStepDatesArrayValue = function (item) {

        settings.arrStepDates.push(item);
    };
    /** /Set Step Dates Array */
    
    /** Set AES Filed Valid */
    VWSurveys.setAesFiledValid = function (valid) {

        settings.blAesFiledValid = valid;
    };
    /** /Set AES Filed Valid */

    /** Set ISF Filed Valid */
    VWSurveys.setIsfFiledValid = function (valid) {

        settings.blIsfFiledValid = valid;
    };
    /** /Set ISF Filed Valid */
    
    /** Set Current Step */
    VWSurveys.setCurrentStep = function (step) {
        
        if (settings.blAesFiledValid || settings.blIsfFiledValid) {
            settings.idxCurrentStep = step;
        }else {
            if(step > 3) {
                settings.idxCurrentStep = (step - 1);
            }else {
                settings.idxCurrentStep = step;
            }
        }
    };
    /** /Set Current Step */
    
    /** Delete Survey **/
    VWSurveys.deleteSurvey = function (id, title, btn) {
   	 var $this = this;
        bootbox.confirm( settings.messageTitle + 'Would you like to delete survey "' + title + '" ?', function (result) {        	
            if (result) {
            	
            	$btn = $( btn );
            	
            	settings.objLadda = Ladda.create($btn.get(0));
                settings.objLadda.start();
                
                $.ajax( {
            	 	url: "/survey/" + id + "/destroy",
            	 	success: function( result ) {
            	 		
            	 		if( result.indexOf('error') === -1 )
            	 		{
            	 			// success	
            	 			VWUtility.resetLadda(settings.objLadda);
            	 			location.href = "/survey/surveylist?status=deleted";
            	 		}
        			    else
        			    {
        			    	// error
        			    	VWUtility.resetLadda(settings.objLadda);
        			    	console.log( result );
        			    }
          			}
	      		});
            }
        });
    }
    /** Delete Survey **/

    /** Set Step Dates Array */
    VWSurveys.setStepEnableArrayValue = function (item) {

        settings.arrStepEnable.push(item);
    };

    /*** PUBLIC METHODS ***/

    /** Setup Components */
    VWSurveys.setupComponents = function () {
        setupProgressStep();
    };
    /** /Setup Components */
 
    /* Init */
    VWSurveys.init = function () {
		
		bindDataTables()        
		$(window).resize($.throttle(settings.tmrThrottle, this.setupComponents));
    };
    /* /Init */
    
    VWSurveys.init();

}(jQuery, window.VWSurveys = window.VWSurveys || {}));

