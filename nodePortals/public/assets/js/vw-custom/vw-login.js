/*****************
*   VW Login     *
*****************/
(function ($, VWLogin, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idButtonSignIn: 'btnSignIn',
        classLaddaBtn: 'ladda-button',
        urlResetPassword: '/account/forgot'
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

    /** Show Alert */
    var showAlert = function(message, type)
    {
        var alertBox = $('#alertBox');

        if(type == 'Success')
        {
            alertBox.removeClass('alert-danger');
            alertBox.addClass('alert-success');
        }
        else if (type == 'Error')
        {
            alertBox.removeClass('alert-success');
            alertBox.addClass('alert-danger');
        }

        $('#alertType').text(type);
        $('#alertMessage').text(message);
        alertBox.show();
    }
    /** /Show Alert */
    
    /** Bind Forms */
    var bindForms = function() {

        $('#' + settings.idButtonSignIn).click(function(){
            $('form').validate({
                submitHandler: function (form) {
                    var $objLadda = Ladda.create($('#btnSignIn').get(0));
                    $objLadda.start();
                    form.submit();
                }
            });
        });

        $('#alertBox .close').click(function() {
            $('.alert').hide();
        });

        $('#btnForgotPassword').click(function() {
            var username = $('#username').val();

            if (username != '')
            {
                // Start spinner
                var $objLadda = Ladda.create($(this).get(0));
                $objLadda.start();

                $.ajax({
                    url: settings.urlResetPassword,
                    type: "POST",
                    dataType: "html",
                    data:
                    {
                        username: username
                    },
                    success: function (data)
                    {
                        var responseData = jQuery.parseJSON(data);
                        console.log(responseData['success']);

                        if(responseData['success'])
                        {
                            showAlert(responseData['status'], 'Success');
                        }
                        else
                        {
                            showAlert(responseData['status'], 'Error');
                        }

                        $objLadda.stop();
                    },
                    error: function (data)
                    {
                        showAlert(data.responseText, 'Error');
                        $objLadda.stop();
                    }
                }).always(function(){
                    VWUtility.resetLadda($objLadda);
                });
            }
            else
            {
                showAlert('Please specify your username.', 'Error');
            }
        });
    };
    /** /Bind Forms */
    
    VWLogin.forgotPasswordPress = function (){
    	$('#btnForgotPassword').click();
    }
    

    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindForms();
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWLogin = window.VWLogin || {}));