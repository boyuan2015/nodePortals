$().ready(function() {
    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        classLaddaBtn: 'ladda-button',
        urlPosUpdate: '/pos/{id}',
        urlPosDelete: '/pos/{id}'
    };
    /* /Settings */

    $("#selPosType").change(function(){
        var posType = $(this).val();

        switch (posType){
            case 'DEMO':
                $('#div-connectionstring').hide();
                $('#div-webservice').hide();
                break;

            case 'ALOHA':
            case 'DINERWARE':
                $('#div-connectionstring').hide();
                $('#div-webservice').show();
                break;

            default:
                $('#div-connectionstring').show();
                $('#div-webservice').show();
                break;
        }

    });

    $('#alertBox .close').click(function() {
        $('.alert').hide();
    });

    $("#btnSavePos").click(function(){
        // Start spinner
        var $objLadda = Ladda.create($(this).get(0));
        $objLadda.start();

        // Call update method and display results.
        //var posType = $('#selPosType').val();
        
        var restaurantId = $('#hidRestaurantId').val();        
        var webserviceURL = $('#txtWebServiceURL').val();
        var connectionString = $('#txtConnectionString').val();

        $.ajax({
            url: settings.urlPosUpdate.replace('{id}', restaurantId.toString()),
            type: "PUT",
            dataType: "html",
            data:
            {
                id: restaurantId,
                posType: posType,
                webserviceURL: webserviceURL,
                connectionString: connectionString
            },
            success: function (data)
            {
                var responseData = jQuery.parseJSON(data);
                console.log(responseData['success']);

                if(responseData['success'])
                {
                    // In the event we were creating a new POS type, we now need to disable the
                    // type selector to follow requirements about POS Type updates.
                    var selPosType = $('#selPosType');

                    if( selPosType.attr('disabled') == undefined )
                    {
                        selPosType.attr('disabled', 'disabled');
                        $('#btnDeletePos').show();
                    }

                    ShowAlert(responseData['status'], 'Success');
                }
                else
                {
                    ShowAlert(responseData['status'], 'Error');
                }

                $objLadda.stop();
            },
            error: function (data)
            {
                ShowAlert(data.responseText, 'Error');

                $objLadda.stop();
            }
        });
    });

    $("#btnDeletePos").click(function(){
        // Start spinner
        var $objLadda = Ladda.create($(this).get(0));
        $objLadda.start();

        // Call update method and display results.
        var restaurantId = $('#hidRestaurantId').val();

        $.ajax({
            url: settings.urlPosDelete.replace('{id}', restaurantId.toString()),
            type: "DELETE",
            dataType: "html",
            data:
            {
                id: restaurantId
            },
            success: function (data)
            {
                var responseData = jQuery.parseJSON(data);
                console.log(responseData['success']);

                if(responseData['success'])
                {
                    ShowAlert(responseData['status'], 'Success');
                    ResetNewPos();
                }
                else
                {
                    ShowAlert(responseData['status'], 'Error');
                }

                $objLadda.stop();
            },
            error: function (data)
            {
                ShowAlert(data.responseText, 'Error');

                $objLadda.stop();
            }
        });
    });
} );

function ShowAlert(message, type)
{
    if(type == 'Success')
    {
        $('#alertBox').removeClass('alert-danger');
        $('#alertBox').addClass('alert-success');
    }
    else if (type == 'Error')
    {
        $('#alertBox').removeClass('alert-success');
        $('#alertBox').addClass('alert-danger');
    }

    $('#alertType').text(type);
    $('#alertMessage').text(message);
    $('#alertBox').show();
}

// Reset the form to create a new POS.
function ResetNewPos()
{
    var selPosType = $('#selPosType');
    selPosType.removeAttr('disabled');
    selPosType.val('ALOHA');

    $('#txtWebServiceURL').val('');
    $('#txtConnectionString').val('');

    $('#div-webservice').show();
    $('#div-connectionstring').hide();

    $('#btnDeletePos').hide();
}