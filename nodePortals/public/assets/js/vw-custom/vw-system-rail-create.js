/***************************
*   VW System Rail Create  *
***************************/
(function ($, VWSystemRailCreate, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idBtnCreateRail: 'btnCreateRail',
        idFormCreateRail: 'frmCreateRail',
        urlSystemStoreRail: '/system/storeRail',
        urlSystemCreateRail: '/system/createRail'
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

    /** Bind Forms */
    var bindForms = function(){

        $.validator.addMethod('macAddress', function(value) {
            var regex = /^([0-9a-f]{1,2}[\.:-]){5}([0-9a-f]{1,2})$/i;
            return regex.test(value);
        }, ' Invalid MAC Address.');

        // Base Station - Create or Update
        $('#' + settings.idBtnCreateRail).click(function(){

            var $btn = $(this);

            $('#' + settings.idFormCreateRail).validate({
                rules: {
                    txtMacAddress: {
                        macAddress: true
                    }
                },
                submitHandler: function (form) {

                    settings.objLadda = Ladda.create($btn.get(0));
                    settings.objLadda.start();

                    createRail(form);
                }
            });
        });
    };
    /** /Bind Forms */


    /** Create RAIL */
    var createRail = function(form){

        var options = {
            url: settings.urlSystemStoreRail,
            dataType: 'json',
            success: function (response) {

                var jsonData = $.parseJSON(response);

                if ((jsonData != null) && (jsonData.success)) {

                    // Success!
                    window.location = (settings.urlSystemCreateRail + '?status=' + jsonData.status);

                } else if (jsonData != null) {

                    // Error #1
                    // Error #1
                    VWUtility.showDismissibleAlert('#panelBodyRail', VWUtility.getAlertTypes().ALERT_TYPE_DANGER,
                        'Error:', 'Problem creating Charging Station (' + jsonData.status + ').');
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
    /** /Create RAIL */


    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindForms();
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWSystemRailCreate = window.VWSystemRailCreate || {}));