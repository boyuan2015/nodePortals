$().ready(function() {
    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        classLaddaBtn: 'ladda-button',
        urlResetVerify: '/account/reset'
    };
    /* /Settings */

    $('#alertBox .close').click(function() {
        $('.alert').hide();
    });

    $("#btnResetVerify").click(function(){
        // Start spinner
        var $objLadda = Ladda.create($(this).get(0));
        $objLadda.start();

        // Call update method and display results.
        var token = $('#hidToken').val();
        var challenge = $('#txtChallenge').val();
        var password = $('#txtPassword').val();

        $.ajax({
            url: settings.urlResetVerify,
            type: "POST",
            dataType: "html",
            data:
            {
                token: token,
                challenge: challenge,
                password: password
            },
            success: function (data)
            {
                var responseData = jQuery.parseJSON(data);
                console.log(responseData['success']);

                if(responseData['success'])
                {
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
    $('#alertMessage').html(message);
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