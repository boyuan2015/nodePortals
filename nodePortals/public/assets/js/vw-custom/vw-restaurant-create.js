/***************************
*   VW Restaurant Create   *
***************************/
(function ($, VWRestaurantCreate, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idFormCreate: 'frmCreateRestaurant',
        idBtnCreate: 'btnCreateRestaurant',
        idPanelBodyRestaurant: 'panelBodyRestaurant',
        classFormControlTipText: 'form-control-tip-txt',
        urlRestaurant: '/restaurant/',
        objLadda: null
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

    /** Bind Form */
    var bindForm = function(){

        $('.' + settings.classFormControlTipText).on({
           change: function(){

               var num = $(this).val();
               var rel = $(this).data('rel');
               if(num !== '' && $.isNumeric(num)){
                   $('#' + rel).attr('required', 'true');
               }else{
                   $('#' + rel).removeAttr('required');
               }
           }
        });

        $('#' + settings.idBtnCreate).click(function(){

            var $btn = $(this);

            $('#' + settings.idFormCreate).validate({
                submitHandler: function (form) {

                    settings.objLadda = Ladda.create($btn.get(0));
                    settings.objLadda.start();

                    createRestaurant(form);
                }
            });
        });
    };
    //-->

    /** Create Restaurant */
    var createRestaurant = function(form){

        var options = {
            dataType: 'json',
            success: function (response) {

                var jsonData = $.parseJSON(response);

                if ((jsonData != null) && (jsonData.success)) {

                    // Success!
                    window.location = (settings.urlRestaurant + jsonData.data.id + '?status=created');

                } else if (jsonData != null) {

                    // Error #1
                    VWUtility.showDismissibleAlert('#' + settings.idPanelBodyRestaurant, VWUtility.getAlertTypes().ALERT_TYPE_DANGER,
                        'Error:', 'Problem creating Restaurant (' + jsonData.status + ').');
                    VWUtility.scrollToTop();
                    VWUtility.resetLadda(settings.objLadda);
                }
            },
            error: function () {
                // Error #2
                VWUtility.resetLadda(settings.objLadda);
            }
        };

        $(form).ajaxSubmit(options);
    };
    /** /Create Restaurant */


    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindForm();
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWRestaurantCreate = window.VWRestaurantCreate || {}));