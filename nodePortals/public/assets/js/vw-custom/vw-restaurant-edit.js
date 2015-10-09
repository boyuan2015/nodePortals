/*************************
*   VW Restaurant Edit   *
*************************/
(function ($, VWRestaurantEdit, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idFormCreate: 'frmUpdateRestaurant',
        idBtnCreate: 'btnUpdateRestaurant',
        idHfId: 'hfId',
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
            var id = $('#' + settings.idHfId).val();

            $('#' + settings.idFormCreate).validate({
                submitHandler: function (form) {

                    settings.objLadda = Ladda.create($btn.get(0));
                    settings.objLadda.start();

                    updateRestaurant(form, id);
                }
            });
        });
    };
    //-->

    /** Update Restaurant */
    var updateRestaurant = function(form, idVal){

        var retID = idVal;

        var options = {
            data: { id: idVal, _method: 'PUT' },
            dataType: 'json',
            success: function (response) {

                var jsonData = $.parseJSON(response);

                if ((jsonData != null) && (jsonData.success)) {

                    // Success!
                    window.location = (settings.urlRestaurant + retID + '?status=updated');

                } else if (jsonData != null) {

                    // Error #1
                    VWUtility.showDismissibleAlert('#' + settings.idPanelBodyRestaurant, VWUtility.getAlertTypes().ALERT_TYPE_DANGER,
                        'Error:', 'Problem updating Restaurant (' + jsonData.status + ').');
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
    /** /Update Restaurant */


    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindForm();
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWRestaurantEdit = window.VWRestaurantEdit || {}));