/*********************
*   VW VWSurveySchedules   *
*********************/
(function ($, VWSurveySchedules, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idDt: 'dt-survey',
        idBtnSearch: 'btnSearch',
        classAExpand: 'a-expand',
        classPlusIcon: 'fa-plus-square-o',
        classMinusIcon: 'fa-minus-square-o',
        classSpinnerIcon: 'fa-spinner',
        classContainerDataTable: 'container-data-table',
        urlShowCompanyChildrenInline: '/survey/{id}/children',
        objSpinner: null,
        objLadda: null,
        intSpinnerRemoveDelay: 1000,
        messageTitle: '<strong>Scheduled Survey</strong><br />'
    };
    /* /Settings */

	var bindSearchRange = function () {
    	// Initialize daterange picker
        $('#searchrange').val(moment().format('MM/DD/YYYY 00:00:00') + ' - ' + moment().add(1, 'years').format('MM/DD/YYYY 00:00:00'));
        $("input:hidden[name='hidSearchRangeFrom']").val(moment().format('MM/DD/YYYY 00:00:00'));
        $("input:hidden[name='hidSearchRangeTo']").val(moment().add(1, 'years').format('MM/DD/YYYY 00:00:00'));
    
        $('#searchrange').daterangepicker({
            startDate: moment().format('MM/DD/YYYY'),
            endDate: moment().add(1, 'years').format('MM/DD/YYYY'),
            timePicker: true,
            timePicker12Hour: false,
            timePickerIncrement: 10,
            format: 'MM/DD/YYYY hh:mm:ss'
        });
    
        $('#searchrange').on('apply.daterangepicker', function(ev, picker) {
            $("input:hidden[name='hidSearchRangeFrom']").val(picker.startDate.format('MM/DD/YYYY hh:mm:ss'));
            $("input:hidden[name='hidSearchRangeTo']").val(picker.endDate.format('MM/DD/YYYY hh:mm:ss'));
        });
        
        $('#btnSearch').on({
        	click: function(){        		
        		var from 	= $("input:hidden[name='hidSearchRangeFrom']").val();
        		var to 		= $("input:hidden[name='hidSearchRangeTo']").val();
        		
            	location.href = "/survey/schedule?from=" + from + "&to=" + to;
        	}
    	});
	};

    /*** PRIVATE METHODS ***/
    
    /** Bind DataTables */
    var bindDataTables = function() {

        // Loading Spinner
        settings.objSpinner = VWUtility.createSpinner('.' + settings.classContainerDataTable);

        // DataTable
        var $oTable = $('#' + settings.idDt);

        $oTable.dataTable({
        	"dom": "<'row'<'col-xs-3'l><'col-xs-6'<'visual-search-container'>><'col-xs-3'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
            'aaSorting': [[1, 'asc']],
            'aoColumns': [
                { 'bSortable': false },
                null,
                null,
                null,
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
        
        $( '#search-parameter-box' ).appendTo( $( '.visual-search-container' ) );
        $( '#search-parameter-box' ).removeClass( 'hidden' );

        // Row Expand or Collapse
        $oTable.find('.' + settings.classAExpand).on({
           click: function(){
               handleScheduledSurveyRowExpandOrCollapse(this, $oTable);
           }
        });
    };
    /** /Bind DataTables */

    /** Handle Survey schedules Row Expand Or Collapse */
    var handleScheduledSurveyRowExpandOrCollapse = function($oA, $oTable){

        var nTr = $($oA).parents('tr')[0];
        var id = $(nTr).data('id');
        if ($oTable.fnIsOpen(nTr)) {

            $($oA).find('i').addClass(settings.classPlusIcon);
            $($oA).find('i').removeClass(settings.classMinusIcon);
            $oTable.fnClose(nTr);

        }else{
        	
        	$($oA).find('i').addClass(settings.classSpinnerIcon);
            $($oA).find('i').removeClass(settings.classPlusIcon);

            $.ajax({
                url: settings.urlShowCompanyChildrenInline.replace('{id}', id.toString()),
                type: "GET",
                dataType: "html",
                data: { id: id },
                success: function (data) {
                    $($oA).find('i').addClass(settings.classMinusIcon);
                    $($oA).find('i').removeClass(settings.classSpinnerIcon);
                    $oTable.fnOpen(nTr, data, 'details');
                },
                error: function (data) {
                	$($oA).find('i').addClass(settings.classPlusIcon);
                    $($oA).find('i').removeClass(settings.classSpinnerIcon);
                    console.log('error: ' + data);
                }
            });
        }
    }
    /** /Handle VWSurvey schedules Row Expand Or Collapse */

	 /** Delete Survey **/
    VWSurveySchedules.deleteSurvey = function (id, title, btn) {
   	 var $this = this;
        bootbox.confirm( settings.messageTitle + 'Would you like to delete scheduled survey "' + title + '" ?', function (result) {
            if (result) {

            	$btn = $( btn );
            	
            	settings.objLadda = Ladda.create($btn.get(0));
                settings.objLadda.start();
                
                $.ajax( {
            	 	url: "/survey/" + id + "/destroySchedule",
            	 	success: function( result ) {
            	 		
            	 		if( result.indexOf('error') === -1 )
            	 		{
            	 			// success	
            	 			VWUtility.resetLadda(settings.objLadda);
            	 			location.href = "/survey/schedule?status=deleted";
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
    
    /** Delete Available Survey **/
    VWSurveySchedules.deleteAvailableSurvey = function (id, title, btn) {
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
            	 			location.href = "/survey/schedule?status=availableSurveyDeleted";
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

    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindDataTables();
        bindSearchRange();
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWSurveySchedules = window.VWSurveySchedules || {}));