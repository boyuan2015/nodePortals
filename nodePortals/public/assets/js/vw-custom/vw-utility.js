/******************
*   VW Utility    *
******************/
(function ($, VWUtility, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        spinner: {
            color: '#666666'
        },
        classAlertDismissible: 'alert-dismissible',
        classBtnLaddaAuto: 'btn-ladda-auto',
        alert: {
            type: {
                ALERT_TYPE_SUCCESS: 'alert-success',
                ALERT_TYPE_INFO: 'alert-info',
                ALERT_TYPE_WARNING: 'alert-warning',
                ALERT_TYPE_DANGER: 'alert-danger'
            },
            html: '<div class="alert {0} alert-dismissible" role="alert">  <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>{1}</strong> {2}</div>'
        }
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

    /** Bind Global Helpers */
    var bindGlobalHelpers = function(){

        // String Format
        if (!String.prototype.format) {
            String.prototype.format = function() {
                var str = this.toString();
                if (!arguments.length)
                    return str;
                var args = typeof arguments[0],
                    args = (("string" == args || "number" == args) ? arguments : arguments[0]);
                for (arg in args)
                    str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
                return str;
            }
        }
    };
    /** /Bind Global Helpers */


    /*** PUBLIC PROPERTIES ***/

    /** Get Alert Types */
    VWUtility.getAlertTypes = function(){

        return settings.alert.type;
    };
    /** /Get Alert Types */


    /*** PUBLIC METHODS ***/

    /** Create Spinner */
    VWUtility.createSpinner = function(selector){

        var objSpinner = $('<span></span>').appendTo($(selector)
            .parent());

        var spinner = Spinners.create(objSpinner, {
            radius: 20,
            height: 15,
            width: 2.5,
            dashes: 30,
            opacity: 1,
            padding: 3,
            rotation: 700,
            color: settings.spinner.color
        }).play();
        spinner.center();

        return objSpinner;
    };
    /** /Create Spinner */

    /** Reset Spinner */
    VWUtility.resetSpinner = function(objSpinner){

        if(objSpinner !== null){
            Spinners.get(objSpinner).stop();
            Spinners.get(objSpinner).remove();
            $(objSpinner).remove();
        }
    };
    /** /Reset Spinner */

    /** Bind Auto Ladda */
    VWUtility.bindAutoLadda = function(){

        $('.' + settings.classBtnLaddaAuto).on({
            click: function(){
                var objLadda = Ladda.create($(this).get(0));
                objLadda.start();
            }
        });
        //>
    };
    /** /Bind Auto Ladda */

    /** Reset Ladda */
    VWUtility.resetLadda = function(objLadda){

        if(objLadda !== null){
            objLadda.stop();
            objLadda.remove();
        }
    };
    /** /Reset Ladda */

    /** Toast Messages */
    VWUtility.infoToast = function (message)
	{
		VWUtility.toast('info', message );	
	}
    //
	VWUtility.successToast = function (message)
	{
		VWUtility.toast('success', message );	
	}
    //
	VWUtility.errorToast = function (message)
	{
		VWUtility.toast('danger', message );	
	}
    //
	VWUtility.toast = function (type, message)
	{
		$.toast.config.align = 'right';
		$.toast.config.width = 400;

		var options = {
	        	duration: 5000,
	        	sticky: 0,
	        	type: 'danger'
			};
		$.toast(message, options);
	}
    /** /Toast Messages */

    /** Create Dismissible Alert */
    VWUtility.createDismissibleAlert = function(type, title, message){

        var alertClass = '';
        switch(type){
            case settings.alert.type.ALERT_TYPE_SUCCESS:
                alertClass = settings.alert.type.ALERT_TYPE_SUCCESS;
                break;
            case settings.alert.type.ALERT_TYPE_INFO:
                alertClass = settings.alert.type.ALERT_TYPE_INFO;
                break;
            case settings.alert.type.ALERT_TYPE_WARNING:
                alertClass = settings.alert.type.ALERT_TYPE_WARNING;
                break;
            case settings.alert.type.ALERT_TYPE_DANGER:
                alertClass = settings.alert.type.ALERT_TYPE_DANGER;
                break;
        }

        var alertHtml = settings.alert.html.format({ 0: alertClass, 1: title, 2: message });
        return alertHtml;
    };
    /** /Create Dismissible Alert */

    /** Show Dismissible Alert */
    VWUtility.showDismissibleAlert = function(selector, type, title, message, keepPrevious){

        var $container = $(selector);
        if(!keepPrevious && $container.find('.' + settings.classAlertDismissible).length){
            $container.find('.' + settings.classAlertDismissible).remove();
        }

        var alertHtml = VWUtility.createDismissibleAlert(type, title, message);
        $container.prepend(alertHtml);
    };
    /** /Show Dismissible Alert */

    /** Scroll To Top */
    VWUtility.scrollToTop = function(){

        $('body,html').animate({
            scrollTop: 0
        }, 500);
    };
    /** /Scroll To Top */
    
    /*** CONSTRUCTOR ***/

    /* Init */
    var init = function() {

        bindGlobalHelpers();
    };
    /* /Init */

    // Init _self
    init();

}(jQuery, window.VWUtility = window.VWUtility || {}));