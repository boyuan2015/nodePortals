$().ready(function() {
    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        classLaddaBtn: 'ladda-button',
        urlRemoveUser: '/restaurant/{id}/removeuser',
    };
    /* /Settings */

    $('#dt-users').dataTable();

    $('#alertBox .close').click(function() {
        $('.alert').hide();
    });

    $('.removeUserBtn').click(function(){
        // Start spinner
        var $objLadda = Ladda.create($(this).get(0));
        $objLadda.start();

        var restaurantId = $('#spanSelectedRestaurantName').data('restaurant-id');
        var username = $(this).data('username');

        $.ajax({
            url: settings.urlRemoveUser.replace('{id}', restaurantId),
            type: "PUT",
            dataType: "html",
            data:
            {
                username: username
            },
            success: function (data)
            {
                var responseData = jQuery.parseJSON(data);

                $objLadda.stop();

                if(responseData['success'])
                {
                    ShowAlert(responseData['status'], 'Success');
                    window.location.reload();
                }
                else
                {
                    ShowAlert(responseData['status'], 'Error');
                }
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