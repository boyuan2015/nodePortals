$().ready(function() {
    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        classLaddaBtn: 'ladda-button',
        urlUserAdd: '/user/addexisting'
    };
    /* /Settings */

    $('#alertBox .close').click(function() {
        $('.alert').hide();
    });


    $('#btnAddUser').click(function(){
        $("#frmAddUser").validate({
            rules: {
                txtUsername: "required"
            },
            submitHandler: function(form, event) {
                // Prevent default form submission
                event.preventDefault();

                // Start spinner
                var $objLadda = Ladda.create($('#btnAddUser').get(0));
                $objLadda.start();

                // Call update method and display results.
                var restaurantId = $('#hidRestaurantId').val();
                var username = $('#txtUsername').val();
                var restaurantRole = $('#selRestaurantRole option:selected').text();

                $.ajax({
                    url: settings.urlUserAdd,
                    type: "POST",
                    dataType: "html",
                    data:
                    {
                        restaurantId: restaurantId,
                        username: username,
                        restaurantRole: restaurantRole
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