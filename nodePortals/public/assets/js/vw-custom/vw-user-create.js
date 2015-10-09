$().ready(function() {
    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        classLaddaBtn: 'ladda-button',
        urlUserCreate: '/user'
    };
    /* /Settings */

    $('#alertBox .close').click(function() {
        $('.alert').hide();
    });

    $('#chkAssignRestaurant').change(function() {
        if($(this).prop('checked'))
        {
            $('#divRestaurantRole').show();
        }
        else
        {
            $('#divRestaurantRole').hide();
        }
    });

    $('#btnCreateUser').click(function(){
        $("#frmAddUser").validate({
            rules: {
                txtAccountDetailsPhone: {
                    phoneUS: true
                },
                txtPasswordDetailsConfirmPassword: {
                    equalTo: "#txtPasswordDetailsPassword"
                }
            },
            submitHandler: function(form, event) {
                // Prevent default form submission
                event.preventDefault();

                // Start spinner
                var $objLadda = Ladda.create($('#btnCreateUser').get(0));
                $objLadda.start();

                // Call update method and display results.
                var restaurantId = $('#hidRestaurantId').val();
                var username = $('#txtAccountDetailsUsername').val();
                var firstName = $('#txtAccountDetailsFirstName').val();
                var lastName = $('#txtAccountDetailsLastName').val();
                var email = $('#txtAccountDetailsEmail').val();
                var phone = $('#txtAccountDetailsPhone').val().replace(/-/g, '');
                var password = $('#txtPasswordDetailsPassword').val();
                var assignToRestaurant = $('#chkAssignRestaurant').prop('checked');
                var assignLegacyUser = $('#chkAssignLegacyUser').prop('checked');
                var assignLegacyAdmin = $('#chkAssignLegacyAdmin').prop('checked');
                var restaurantRole = $('#selRestaurantRole option:selected').text();
                var legacyRole = $('#selLegacyRole').val();

                $.ajax({
                    url: settings.urlUserCreate,
                    type: "POST",
                    dataType: "html",
                    data:
                    {
                        restaurantId: restaurantId,
                        username: username,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phone: phone,
                        password: password,
                        assignToRestaurant: assignToRestaurant,
                        restaurantRole: restaurantRole,
                        assignLegacyUser: assignLegacyUser,
                        assignLegacyAdmin: assignLegacyAdmin
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