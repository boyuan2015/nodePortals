$().ready(function() {
    /*** GLOBALS ***/

    /* Settings */
    var settings = {
        classLaddaBtn: 'ladda-button',
        urlUserUpdate: '/user/{id}',
        urlChangePassword: '/user/reset'
    };
    /* /Settings */

	if( window.location.href.indexOf( 'account/editProfile' ) == -1 )
	{
		// access from Restaurant/User
		$('#liRestaurants, #liSelectedRestaurant, #liRestaurantUsers').addClass('open, active')
        .find('ul:first').css('display', 'block');	
	}

    $('#alertBox .close').click(function() {
        $('.alert').hide();
    });

    $('#btnUpdateUser').click(function(){
        $("#frmEditUser").validate({
            rules: {
                txtAccountDetailsFirstName: "required",
                txtAccountDetailsLastName: "required",
                txtAccountDetailsEmail: {
                    required: true,
                    email: true
                },
                txtAccountDetailsPhone: {
                    required: true,
                    phoneUS: true
                }
            },
            submitHandler: function(form, event) {
                // Prevent default form submission
                event.preventDefault();

                // Start spinner
                var $objLadda = Ladda.create($('#btnUpdateUser').get(0));
                $objLadda.start();

                // Call update method and display results.
                var username = $('#hidUpdateUsername').val();
                var firstName = $('#txtAccountDetailsFirstName').val();
                var lastName = $('#txtAccountDetailsLastName').val();
                var email = $('#txtAccountDetailsEmail').val();

                $.ajax({
                    url: settings.urlUserUpdate.replace('{id}', username),
                    type: "PUT",
                    dataType: "html",
                    data:
                    {
                        username: username,
                        firstName: firstName,
                        lastName: lastName,
                        email: email
                    },
                    success: function (data)
                    {
                        var responseData = jQuery.parseJSON(data);

                        if(responseData['success'])
                        {
                            ShowAlert(responseData['status'], 'Success');
                        }
                        else
                        {
                            ShowAlert(responseData['status'], 'Error');
                        }
                    },
                    error: function (data)
                    {
                        ShowAlert(data.responseText, 'Error');;
                    }
                }).always(function(){
                    VWUtility.resetLadda($objLadda);
                    VWUtility.scrollToTop();
                });
            }
        });
    });

    $('#btnChangePassword').click(function(){
        $("#frmChangePassword").validate({
            rules: {
                txtPasswordDetailsPassword: "required",
                txtPasswordDetailsConfirmPassword: {
                    equalTo: "#txtPasswordDetailsPassword"
                }
            },
            submitHandler: function(form, event) {
                // Prevent default form submission
                event.preventDefault();

                // Start spinner
                var $objLadda = Ladda.create($('#btnChangePassword').get(0));
                $objLadda.start();

                // Call update method and display results.
                var username = $('#hidChangePasswordUsername').val();
                var password = $('#txtPasswordDetailsPassword').val();

                $.ajax({
                    url: settings.urlChangePassword,
                    type: "POST",
                    dataType: "html",
                    data:
                    {
                        username: username,
                        password: password
                    },
                    success: function (data)
                    {
                        var responseData = jQuery.parseJSON(data);

                        if(responseData['success'])
                        {
                            ShowAlert(responseData['status'], 'Success');
                        }
                        else
                        {
                            ShowAlert(responseData['status'], 'Error');
                        }
                    },
                    error: function (data)
                    {
                        ShowAlert(data.responseText, 'Error');
                    }
                }).always(function(){
                    VWUtility.resetLadda($objLadda);
                    VWUtility.scrollToTop();
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