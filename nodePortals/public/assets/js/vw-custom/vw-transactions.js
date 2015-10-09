$().ready(function() {

    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        idPanelBodySearch: 'panelBodySearch',
        idButtonSearch: 'btnSearch',
        idFrmSearch: 'frmSearch',
        classLaddaBtn: 'ladda-button',
        urlPaymentSearch: '/payment/search'
    };
    /* /Settings */

    // DataTable Draw Callback
    var dataTableDrawCallback = function(){
        VWUtility.bindAutoLadda();
        console.log('dataTableDrawCallback');
    };

    // Initialize search results datatable
    var transactionTable = $('#dt-transaction');
    transactionTable.dataTable( {
        'aaSorting': [[1, 'asc']],
        'aoColumns': [
            null,
            null,
            null,
            null,
            null,
            { 'bSortable': false }
        ],
        "dom": 'T<"clear-both">lfrtip',
        "tableTools": {
            "sSwfPath": '/assets/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf',
            "aButtons": [ 'copy', 'csv', 'pdf', 'print' ]
        },
        "columnDefs": [
            {
                "render": function ( data, type, row ) {
                    
                	if ( $( "input:hidden[name='hidPermPaymentGetDetails']" ).val() == "1" )
                	{
	                    return '<a href="/transaction/' + data + '?' + row[ row.length - 1 ] + '" class="btn btn-default btn-xs btn-ladda-auto ladda-button" data-style="contract">View</a>';
                	}
	                return '';
                },
                "targets": 5
            },
            { "class": "text-center", "targets": 5 }
        ],
        'drawCallback': function () {
            dataTableDrawCallback();
        }
    } );

    /** Process Search */
    var processSearch = function($btn){

        $('#' + settings.idFrmSearch).validate({
            submitHandler: function (form, event) {

                event.preventDefault();

                // Start spinner
                var $objLadda = Ladda.create($btn.get(0));
                $objLadda.start();

                // Make search based on parameters and redirect or update datatable.
                var searchBy = $("input:radio[name='radSearchBy']:checked").val();
                var searchParameter = '';
                var dateFrom = $("input:hidden[name='SearchRangeFrom']").val();
                var dateTo = $("input:hidden[name='SearchRangeTo']").val();
                
                dateFrom = $('#searchrangeFrom').val();
                dateTo = $('#searchrangeTo').val();
                                
				
                if(searchBy == 'chdn'){
                    searchParameter = '%' + $("input:text[name='txtSearchParameter']").val() + '%';
                }else {
                    searchParameter = $("input:text[name='txtSearchParameter']").val();
                };               
                
                                
				var query = "type=" + searchBy +
					  		"&parameter=" + searchParameter +
				   	   		"&dateFrom=" + dateFrom +
					   		"&dateTo=" + dateTo;
				
                $.ajax({
                    url: settings.urlPaymentSearch,
                    type: "POST",
                    dataType: "html",
                    data: {
                              type: searchBy,
                              parameter: searchParameter,
                              dateFrom: dateFrom,
                              dateTo: dateTo
                          },
                    success: function (data)
                    {
                        var responseData = jQuery.parseJSON(data);

                        if(responseData['success'])
                        {
                            VWUtility.showDismissibleAlert('#' + settings.idPanelBodySearch, VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS,
                                'Success:', 'Your search completed.');

                            $('#transactionCount').text(responseData['data'].length);
                            transactionTable.fnClearTable();

                            if(responseData['data'].length > 0)
                            {
                            	for( var index = 0; index < responseData['data'].length; index++ )
                            	{
                            		responseData['data'][index][ responseData['data'][index].length ] = query;
                            	}
                            	
                                transactionTable.fnAddData(responseData['data']);
                                transactionTable.fnDraw();
                            }
                        }
                        else
                        {
                            VWUtility.showDismissibleAlert('#' + settings.idPanelBodySearch, VWUtility.getAlertTypes().ALERT_TYPE_WARNING,
                                'Error:', responseData['status']);
                        }
                    },
                    error: function (data)
                    {
                        VWUtility.showDismissibleAlert('#' + settings.idPanelBodySearch, VWUtility.getAlertTypes().ALERT_TYPE_WARNING,
                            'Error:', data.responseText);
                    }
                }).always(function(){
                    VWUtility.resetLadda($objLadda);
                });
            }
        });
    };
    /** /Process Search */

    // Wire up controls
    $('#btnSearch').on({
        click: function(){
            processSearch($(this));
        }
    });

    $("input:radio[name='radSearchBy']").click(function()
    {
    	updateRadio($(this).val());
    });
    
    var updateRadio = function ( val ) {
    	switch( val )
        {
            case 'DateRange':
            	$('#txtSearchParameter').prop('required', false);
            	$('#lblSearchValue').hide();
            	$('#divSearchValue').hide();
            	$('#txtSearchParameter-error').hide();
                break;
            default:
	        $('#txtSearchParameter').prop('required', true);
            	$('#lblSearchValue').show();
            	$('#divSearchValue').show();
            	$('#txtSearchParameter-error').show();
                break;
        }	
    }

    $("input:text[name='txtSearchParameter']").keypress(function (e) {
        if (e.which == 13) {
            $('#btnSearch').click();
        }
    });
    
    // Process query string
    
    var getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        	results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    var start = "";
  	var end   = "";
    
    if( getParameterByName( 'type' ) != "" )
    {
    	var type 	= getParameterByName( 'type' );
    	var parameter 	= getParameterByName( 'parameter' );
    	var dateFrom 	= getParameterByName( 'dateFrom' );
    	var dateTo 	= getParameterByName( 'dateTo' );
    	
    	$("input[name=radSearchBy][value=" + type + "]").attr('checked', 'checked');
        
        if(type == 'chdn'){
            $("input:text[name='txtSearchParameter']").val( '%' + parameter + '%' );    
        }else {
            $("input:text[name='txtSearchParameter']").val(parameter); 
        };        
               
        $("#DateRange").prop("checked", true)
        updateRadio(type);
        
        // Initialize daterange picker value
        $('#searchrangeFrom').val( dateFrom );
        $('#searchrangeTo').val( dateTo );
        
        $("input:hidden[name='hidSearchRangeFrom']").val( dateFrom );
        $("input:hidden[name='hidSearchRangeTo']").val( dateTo );
        
        start = dateFrom;
        end   = dateTo;
        
        $('#btnSearch').click();
    }
    else
    {
        start = moment().subtract(1, 'days').format('MM/DD/YYYY 00:00:00');
        end   = moment().format('MM/DD/YYYY 23:59:59');

    	$('#searchrangeFrom').val(start);
        $('#searchrangeTo').val(end);
        
    	$("input:hidden[name='hidSearchRangeFrom']").val(start);
	$("input:hidden[name='hidSearchRangeTo']").val(end);
    }
	
	// Initialize daterange picker From Date
    $('#searchrangeFrom').daterangepicker({
        startDate: start,
        endDate: end,
        timePicker: true,
        timePicker12Hour: false,
        timePickerIncrement: 10,
        format: 'MM/DD/YYYY hh:mm:ss'
    });

	// Initialize daterange picker To Date
    $('#searchrangeTo').daterangepicker({
        startDate: start,
        endDate: end,
        timePicker: true,
        timePicker12Hour: false,
        timePickerIncrement: 10,
        format: 'MM/DD/YYYY hh:mm:ss'
    });

    $('#searchrangeFrom').on('apply.searchrangeFrom', function(ev, picker) {
        console.log('apply.daterangepicker : ' + picker.startDate);
        $("input:hidden[name='hidSearchRangeFrom']").val(picker.startDate.format('MM/DD/YYYY HH:mm:ss'));        
    });

    $('#searchrangeTo').on('apply.searchrangeTo', function(ev, picker) {
        console.log('apply.daterangepicker : ' + picker.endDate);
        $("input:hidden[name='hidSearchRangeTo']").val(picker.endDate.format('MM/DD/YYYY HH:mm:ss'));
    });

    
    
    
} );