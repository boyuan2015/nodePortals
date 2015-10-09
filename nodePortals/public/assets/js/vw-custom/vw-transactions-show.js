$().ready(function() {
    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        classLaddaBtn: 'ladda-button',
        urlPaymentRefund: '/payment/refund',
        urlTransactionEmail: '/transaction/email',
        messageTitle: '<strong>Transaction</strong><br />',
        objLadda: null
    };
    /* /Settings */

    $('#dt-transaction-detail').dataTable(
        {
            "paging":   false,
            "ordering": false,
            "filter": false,
            "info":     false
        }
    );

    $(".btn-refund-toggle").click(function(){
        var paymentId = $(this).data("payment-id");
        $("input:hidden[name='hidRefundPaymentId']").val(paymentId);
        $('#div-submit-refund').show();
    });

	$("input:text[name='txtRefundAmount']").numeric({
		allowMinus: false,
		maxDecimalPlaces: 2
	});

    $("#btnIssueRefund").click(function(){
        
        settings.objLadda = Ladda.create($(this).get(0));
        
		$('#frmRefunds').validate({
   			submitHandler: function (form) {
   				
   				// Call refund method and display results.
                var paymentId = $("input:hidden[name='hidRefundPaymentId']").val();
                var refundAmount = $("input:text[name='txtRefundAmount']").val();
                var refundReason = $("textarea[name='txtRefundMessage']").val();
				var transactionId = $( '#lnkTransactionId' ).text();
        				
   				bootbox.confirm( settings.messageTitle + 'Are you sure want to refund $' + refundAmount + ' of this payment?', function (result) {        	
                    if (result) {
                    	
                  		// Start spinner
        		        settings.objLadda.start();                        
        				
                        $.ajax({
                            url: settings.urlPaymentRefund,
                            type: "POST",
                            dataType: "html",
                            data:
                            {
                                id: paymentId,
                                amount: refundAmount,
                                reason: refundReason
                            },
                            success: function (data)
                            {
                                var responseData = jQuery.parseJSON(data);
                                console.log(responseData['success']);
                
                                if(responseData['success'])
                                {
                                	VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS, 'Success:', responseData['status']);
                                	
                                	$.get( '/transaction/' + transactionId + '/getRefunds', function(data) {
                			
                            			data = JSON.parse( data );
                    					
                    					// Workaround: reset the bootstrap striped table color
                    					if( $( '#dt-transaction-refunds-detail' ).find( 'tr' ).length % 2 == 0 )
                    					{
                    						$( '#dt-transaction-refunds-detail tr:last' ).after( '<tr></tr>' );
                    					}
                    					$( '#dt-transaction-refunds-detail' ).find("tr:gt(0)").hide();
                    					
                    					// Add refunds data to table
                    					for ( var paymentId in data )
                    					{
                                            if ( paymentId === 'length' || !data.hasOwnProperty( paymentId ) )
                                            	continue;
                                                                    
                                            var refunds = data[ paymentId ];
                                            refunds.forEach( function ( entry ) {
                    														
                                            	$( '#dt-transaction-refunds-detail tr:last' ).after(
                                            		'<tr><td>' + paymentId +
                                            		'</td><td>' + entry.referenceCode +
                                            		'</td><td>' + entry.entryDate +
                                            		'</td><td>' + ( ( entry.reason != null ) ? entry.reason : "" ) +
                                            		'</td><td>$' + String( entry.amount ).replace('-','') + '</td></tr>'
                                            	);
                                            	                        	
                                            } );
                                        }
                    						
                    					$("input:text[name='txtRefundAmount']").val( "" );
                        				$("textarea[name='txtRefundMessage']").val( "" );
                        				$('#div-submit-refund').hide();
            						} );                	
                                }
                                else
                                {
                                	VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', responseData['status']);
                                }                        
                            },
                            error: function (data)
                            {
                                VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', data.responseText);
                            }
                        }).always(function(){
                            VWUtility.resetLadda(settings.objLadda);
                            VWUtility.scrollToTop();
                        }); // Ajax
                    	
                    } // if result
                } ); // bootbox
   					
            }
        });
    });

    $("#btnEmail").click(function(){
        // Start spinner
        var $objLadda = Ladda.create($(this).get(0));
        $objLadda.start();

        // Call refund method and display results.
        var transactionId = $('#lnkTransactionId').data('transactionid');
        var email = $('#txtEmailAddress').val();

        $.ajax({
            url: settings.urlTransactionEmail,
            type: "POST",
            dataType: "html",
            data:
            {
                id: transactionId,
                email: email
            },
            success: function (data)
            {
                var responseData = jQuery.parseJSON(data);
                console.log(responseData['success']);

                if(responseData['success'])
                {
                    VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS, 'Success:', responseData['status']);
                }
                else
                {
                    VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', responseData['status']);
                }
            },
            error: function (data)
            {
                VWUtility.showDismissibleAlert('#panel-body', VWUtility.getAlertTypes().ALERT_TYPE_DANGER, 'Error:', data.responseText);
            }
        }).always(function(){
            VWUtility.resetLadda($objLadda);
        });
    })
} );
