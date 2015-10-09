/**********************
*   VW Base Station   *
***********************/
(function ($, VWBaseStation, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        classBtnDeleteRfIdTag: 'btn-delete-rf-id-tag',
        classFormGroupChargers: 'form-group-chargers',
        classRfIdDiv: 'rf-id-div',
        classSpinnerIcon: 'fa-spinner',
        classTimesIcon: 'fa-times',
        classContainerDataTable: 'container-data-table',
        classBtnAuthorize: 'btn-authorize',
        classBtnDeauthorize: 'btn-deauthorize',
        classBtnDeprovision: 'btn-deprovision',
        classTdAuthStatus: 'td-auth-status',
        idFormCreateOrUpdateBaseStation: 'frmCreateOrUpdateBaseStation',
        idBtnCreateOrUpdateBaseStation: 'btnCreateOrUpdateBaseStation',
        idFormCreateOrUpdateChargingStations: 'frmCreateOrUpdateChargingStations',
        idBtnCreateOrUpdateChargingStations: 'btnCreateOrUpdateChargingStations',
        idTimePickerControl: 'txtBaseStationUpdateTime',
        idHfHwId: 'hfHwId',
        idHfRfIdCollection: 'hfRfIdCollection',
        idAAddRfIdTag: 'a-add-rf-id-tag',
        idDtRails: 'dt-rails',
        textConfirmationRequired: 'Confirmation Required',
        textCreateChargingStation: 'Create Charging Station',
        textActionDescriptionBase: 'Would you like to {0} this item?',
        textMessageDelete: 'Delete',
        textNoStationsToDisplay: 'There are no stations to display.',
        textRailAuthorize: 'Authorize',
        textRailDeauthorize: 'Deauthorize',
        textRailDeprovision: 'Deprovision',
        urlBaseStation: '/hardware/baseStation',
        urlStoreBaseStation: '/hardware/storeBaseStation',
        urlUpdateBaseStation: '/hardware/{id}/updateBaseStation',
        urlStoreChargingStation: '/hardware/storeChargingStation',
        urlDeleteChargingStation: '/hardware/{id}/deleteChargingStation',
        urlGetChargingStations: '/hardware/{id}/chargingStations',
        objLadda: null,
        numRfIdRowCount: 0,
        htmlCenterEmText: '<div class="text-center"><em>{$}</em></div>',
        rails: {
            actionTypes: {
                deprovisionRail: 'deprovisionRail',
                authorizeRail: 'authorizeRail',
                deauthorizeRail: 'deauthorizeRail'
            }
        }
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/

    /** Bind DataTables */
    var bindDataTables = function() {

        if($('#' + settings.idDtRails).length){

            // Loading Spinner
            settings.objSpinner = VWUtility.createSpinner('.' + settings.classContainerDataTable);

            // DataTable
            var $oTable = $('#' + settings.idDtRails);
            $oTable.dataTable({
                'aaSorting': [[1, 'asc']],
                'aoColumns': [
                    null,
                    null,
                    null,
                    { 'bSortable': false }
                ],
                'initComplete': function(tblSettings, tblJson) {
                    setTimeout(function(){

                        // Loading Spinner remove & show data-table
                        VWUtility.resetSpinner(settings.objSpinner);
                        $('.' + settings.classContainerDataTable).css('visibility', 'visible');
                    }, settings.intSpinnerRemoveDelay);
                }
            });

            // Button Actions
            bindRailsButton(settings.rails.actionTypes.deauthorizeRail);
            bindRailsButton(settings.rails.actionTypes.authorizeRail);
            bindRailsButton(settings.rails.actionTypes.deprovisionRail);

        }else{
            $('.' + settings.classContainerDataTable).css('visibility', 'visible');
        }
    };
    /** /Bind DataTables */


    /** Bind Rails Button */
    var bindRailsButton = function(type){

        switch(type){

            case settings.rails.actionTypes.deauthorizeRail:

                $('.' + settings.classBtnDeauthorize).off().on({
                    click: function(){

                        var $btn = $(this);
                        var id = $btn.data('id');
                        var $row = $btn.parents('tr');
                        var messageIntro = '<strong>RAIL - ' + settings.textConfirmationRequired + '</strong><br />';

                        bootbox.confirm(messageIntro + settings.textActionDescriptionBase.format({ 0: settings.textRailDeauthorize }), function (result) {
                            if (result) {
                                handleRailsAction($btn, settings.rails.actionTypes.deauthorizeRail, id, $row);
                            }
                        });
                    }
                });
                break;

            case settings.rails.actionTypes.authorizeRail:

                $('.' + settings.classBtnAuthorize).off().on({
                    click: function(){

                        var $btn = $(this);
                        var id = $btn.data('id');
                        var $row = $btn.parents('tr');
                        var messageIntro = '<strong>RAIL - ' + settings.textConfirmationRequired + '</strong><br />';

                        bootbox.confirm(messageIntro + settings.textActionDescriptionBase.format({ 0: settings.textRailAuthorize }), function (result) {
                            if (result) {
                                handleRailsAction($btn, settings.rails.actionTypes.authorizeRail, id, $row);
                            }
                        });
                    }
                });
                break;

            case settings.rails.actionTypes.deprovisionRail:

                $('.' + settings.classBtnDeprovision).off().on({
                    click: function(){

                        var $btn = $(this);
                        var id = $btn.data('id');
                        var $row = $btn.parents('tr');
                        var messageIntro = '<strong>RAIL - ' + settings.textConfirmationRequired + '</strong><br />';

                        bootbox.confirm(messageIntro + settings.textActionDescriptionBase.format({ 0: settings.textRailDeprovision }), function (result) {
                            if (result) {
                                handleRailsAction($btn, settings.rails.actionTypes.deprovisionRail, id, $row);
                            }
                        });
                    }
                });
                break;
        }
    };
    /** /Bind Rails Button */

    /** Bind Forms */
    var bindForms = function(){

        // Form Validation
        $.validator.addMethod('ipAddress', function(value) {
            var split = value.split('.');
            if (split.length != 4)
                return false;
            for (var i=0; i<split.length; i++) {
                var s = split[i];
                if (s.length==0 || isNaN(s) || s<0 || s>255)
                    return false;
            }
            return true;
        }, ' Invalid IP Address.');

        $.validator.addMethod('macAddress', function(value) {
            var regex = /^([0-9a-f]{1,2}[\.:-]){5}([0-9a-f]{1,2})$/i;
            return regex.test(value);
        }, ' Invalid MAC Address.');

        $.validator.addMethod("unique", function(value, element, params) {
            var prefix = params;
            var selector = jQuery.validator.format("[name!='{0}'][unique='{1}']", element.name, prefix);
            var matches = new Array();
            $(selector).each(function(index, item) {
                if (value == $(item).val()) {
                    matches.push(item);
                }
            });

            return matches.length == 0;
        }, "Value is not unique.");

        // Time Picker
        $('#' + settings.idTimePickerControl).timepicker({
            minuteStep: 1,
            appendWidgetTo: 'body',
            showSeconds: true,
            showMeridian: false,
            defaultTime: false
        });

        // Base Station - Create or Update
        $('#' + settings.idBtnCreateOrUpdateBaseStation).click(function(){

            var $btn = $(this);

            $('#' + settings.idFormCreateOrUpdateBaseStation).validate({
                rules: {
                    txtMacAddress: {
                        macAddress: true
                    },
                    txtRailIpRange: {
                        ipAddress: true
                    }
                },
                submitHandler: function (form) {

                    settings.objLadda = Ladda.create($btn.get(0));
                    settings.objLadda.start();

                    createOrUpdateBaseStation(form);
                }
            });
        });

        // Add RFID Tag
        $('#' + settings.idAAddRfIdTag).on({
            click: function(){

                settings.numRfIdRowCount++;
                var rowCount = settings.numRfIdRowCount;

                var appendHtml = $('<div class="row rf-id-row rf-id-row-extra row-mgn1 required">'
                    + '<label for="txtRfIdTag' + rowCount + '" class="col-sm-2 control-label">RFID Tag</label>'
                    + '<div class="col-sm-6"><div class="input-group">'
                    + '<input id="txtRfIdTag' + rowCount + '" name="txtRfIdTag' + rowCount + '" type="text" class="form-control form-control-rf-id-tag" minlength="16" maxlength="16" unique="rfid" required />'
                    + '<span class="input-group-btn"><button class="btn btn-default btn-clear-rf-id-tag vw-tooltip" type="button" data-toggle="tooltip" data-placement="top" title="Clear RFID Tag">'
                    + '<i class="fa fa-minus-circle"></i></button></span>'
                    + '</div></div>')

                appendHtml.find('.vw-tooltip').tooltip();
                appendHtml.find('.btn-clear-rf-id-tag').on({
                    click: function(){
                        $(this).parents('.rf-id-row').remove();
                        checkButtonTexts();
                    }
                });

                $('.' + settings.classRfIdDiv).append(appendHtml);
                appendHtml.find('input').focus();
                checkButtonTexts();
            }
        });

        // Delete RFID Tag
        bindDeleteRfIdTag();

        // Charging Stations - Create or Update
        $('#' + settings.idBtnCreateOrUpdateChargingStations).click(function(){

            var $btn = $(this);

            $.validator.addClassRules('form-control-rf-id-tag', {
                unique: true
            });

            $('#' + settings.idFormCreateOrUpdateChargingStations).validate({
                submitHandler: function (form) {

                    settings.objLadda = Ladda.create($btn.get(0));
                    settings.objLadda.start();

                    createOrUpdateChargingStations(form);
                }
            });
        });
    };
    /** /Bind Forms */

    /** Bind Delete RFID Tag */
    var bindDeleteRfIdTag = function(){

        $('.' + settings.classBtnDeleteRfIdTag).on({
            click: function(){

                var $btn = $(this);
                var messageIntro = '<strong>RFID Tag - ' + settings.textConfirmationRequired + '</strong><br />';

                bootbox.confirm(messageIntro + settings.textActionDescriptionBase.format({ 0: settings.textMessageDelete }), function (result) {
                    if (result) {

                        $btn.find('i').addClass(settings.classSpinnerIcon)
                            .removeClass(settings.classTimesIcon);
                        var rfIdVal = $btn.data('rf-id');
                        deleteChargingStation(rfIdVal, $btn);
                    }
                });
            }
        });
    };
    /** /Bind Delete RFID Tag */

    /** Check Button Texts */
    var checkButtonTexts = function(){

        if($('.form-control-rf-id-tag').length > 1){
            $('#' + settings.idBtnCreateOrUpdateChargingStations).text(settings.textCreateChargingStation + 's');
        }else{
            $('#' + settings.idBtnCreateOrUpdateChargingStations).text(settings.textCreateChargingStation);
        }
    };
    /** /Check Button Texts */

    /** Create or Update Base Station */
    var createOrUpdateBaseStation = function(form){

        var options = {
            dataType: 'json',
            success: function (response) {

                var jsonData = $.parseJSON(response);

                if ((jsonData != null) && (jsonData.success)) {

                    // Success!
                    window.location = (settings.urlBaseStation + '?status=' + jsonData.status);

                } else if (jsonData != null) {

                    // Error #1
                    VWUtility.resetLadda(settings.objLadda);
                }
            },
            error: function () {
                // Error #2
                VWUtility.resetLadda(settings.objLadda);
            }
        };

        if($('#' + settings.idHfHwId).length){
            var idVal = $('#' + settings.idHfHwId).val();
            options.url = settings.urlUpdateBaseStation.replace('{id}', idVal);
            options.data = { id: idVal, _method: 'PUT' };
        }else{
            options.url = settings.urlStoreBaseStation;
        }

        $(form).ajaxSubmit(options);
    };
    /** /Create or Update Base Station */

    /** Get Charging Stations */
    var getChargingStations = function(){

        var hfHardwareId = $('#hfHardwareId').val();

        $.ajax({
            type: 'POST',
            url: (settings.urlGetChargingStations.replace('{id}', hfHardwareId)),
            data: { id: hfHardwareId },
            success: function (html) {

                if (html != null) {

                    $('.' + settings.classFormGroupChargers).html(html);
                    $('.' + settings.classRfIdDiv).find('.rf-id-row-extra').remove();
                    $('#txtRfIdTag0').val('');
                    bindDeleteRfIdTag();

                } else if (html != null) {

                    // Error #1
                    console.log('getChargingStations #1:');
                }

                VWUtility.resetLadda(settings.objLadda);
            },
            error: function () {
                // Error #2
                console.log('getChargingStations Error #2');
            }
        });
    };
    /** /Get Charging Stations */

    /** Delete Charging Station */
    var deleteChargingStation = function(rfIdVal, btn){

        var resetButton = function(){
            btn.find('i').addClass(settings.classTimesIcon)
                .removeClass(settings.classSpinnerIcon);
        };

        $.ajax({
            type: 'POST',
            url: (settings.urlDeleteChargingStation.replace('{id}', rfIdVal)),
            data: { _method: 'DELETE' },
            dataType: "json",
            success: function (jsonData) {
                if ((jsonData != null) && (jsonData.success)) {

                    $('#txt_' + rfIdVal).parents('.rf-id-row').remove();
                    var $groupChargers = $('.' + settings.classFormGroupChargers);
                    if($groupChargers.find('.rf-id-row').length === 0){
                        $groupChargers.html(settings.htmlCenterEmText.replace('{$}', settings.textNoStationsToDisplay));
                    }
                    VWUtility.showDismissibleAlert('#panelBodyChargers', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS,
                        'Success:', 'Deleted the Charging Station.');

                } else if (jsonData != null) {

                    // Error #1
                    resetButton();
                }
            },
            error: function () {

                // Error #2
                resetButton();
            }
        });
    };
    /** /Delete Charging Station */

    /** Create or Update Charging Stations */
    var createOrUpdateChargingStations = function(form){

        var rfIdCollection = '';
        $(form).find('.form-control-rf-id-tag').each(function(){
            if(rfIdCollection !== '') rfIdCollection += ',';
            rfIdCollection += $(this).val();
        });

        $('#' + settings.idHfRfIdCollection).val(rfIdCollection);

        // Handle Multiple Results
        var handleMultipleResults = function(data){

            var successMessages = '';
            var errorMessages = '';

            var multiple = $.parseJSON(data);

            multiple.forEach(function(item){

                if(item['success']){
                    if(successMessages.length === 0) successMessages += 'Created new Charging Station(s) - ';
                    successMessages += ' (' + item['rfIdTag'] + ')';
                }else{
                    if(errorMessages.length === 0) errorMessages += 'Problem creating Charging Station(s) - ';
                    errorMessages += ' (' + item['rfIdTag'] + ' - ' + item['status'] + ')';
                }
            });

            if(successMessages.length > 0) successMessages += '.';
            if(errorMessages.length > 0) errorMessages += '.';

            if(errorMessages.length > 0){
                VWUtility.showDismissibleAlert('#panelBodyChargers', VWUtility.getAlertTypes().ALERT_TYPE_DANGER,
                    'Error:', errorMessages);
            }

            if(successMessages.length > 0){
                VWUtility.showDismissibleAlert('#panelBodyChargers', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS,
                    'Success:', successMessages, true);
            }
        };
        //>

        // Form Options
        var options = {
            url: settings.urlStoreChargingStation,
            dataType: 'json',
            success: function (response) {

                var jsonData = $.parseJSON(response);

                if ((jsonData != null) && (jsonData.success)) {

                    // Success!
                    if((jsonData.status === 'multiple') && jsonData.data != null){

                        // Multiple Results
                        handleMultipleResults(jsonData.data);
                    }else{
                        // Single Result
                        VWUtility.showDismissibleAlert('#panelBodyChargers', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS,
                            'Success:', 'Created new Charging Station.');
                    }

                    getChargingStations();

                } else if (jsonData != null) {

                    // Error #1
                    VWUtility.showDismissibleAlert('#panelBodyChargers', VWUtility.getAlertTypes().ALERT_TYPE_DANGER,
                        'Error:', 'Problem creating Charging Station (' + jsonData.status + ').');
                    VWUtility.resetLadda(settings.objLadda);
                }
            },
            error: function () {
                // Error #2
                VWUtility.resetLadda(settings.objLadda);
            }
        };
        //>

        $(form).ajaxSubmit(options);
    };
    /** /Create or Update Charging Stations */

    /** Handle RAILs Action */
    var handleRailsAction =function(btn, type, idVal, row){

        settings.objLadda = Ladda.create(btn.get(0));
        settings.objLadda.start();

        var url = ('/hardware/{id}/' + type).format({ id: idVal });

        $.ajax({
            type: 'POST',
            url: url,
            data: { _method: 'PUT' },
            dataType: "json",
            success: function (jsonData) {
                if ((jsonData != null) && (jsonData.success)) {

                    var sMessageType = '';
                    switch(type){
                        case settings.rails.actionTypes.deauthorizeRail:
                            sMessageType = settings.textRailDeauthorize + 'd';
                            row.find('.' + settings.classTdAuthStatus).text('No');
                            btn.addClass(settings.classBtnAuthorize)
                                .removeClass(settings.classBtnDeauthorize)
                                .text(settings.textRailAuthorize);
                            bindRailsButton(settings.rails.actionTypes.authorizeRail);
                            break;
                        case settings.rails.actionTypes.authorizeRail:
                            sMessageType = settings.textRailAuthorize + 'd';
                            row.find('.' + settings.classTdAuthStatus).text('Yes');
                            btn.addClass(settings.classBtnDeauthorize)
                                .removeClass(settings.classBtnAuthorize)
                                .text(settings.textRailDeauthorize);
                            bindRailsButton(settings.rails.actionTypes.deauthorizeRail);
                            break;
                        case settings.rails.actionTypes.deprovisionRail:
                            sMessageType = settings.textRailDeprovision + 'ed';
                            row.remove();
                            break;
                    }

                    VWUtility.showDismissibleAlert('#panelBodyRails', VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS,
                        'Success:', sMessageType + ' the RAIL item.');

                } else if (jsonData != null) {

                    // Error #1
                    console.log('handleRailsAction #1:' + jsonData.status);
                }
            },
            error: function () {

                // Error #2
                console.log('handleRailsAction Error #2');
            }
        }).always(function(){
            VWUtility.resetLadda(settings.objLadda);
        });

    };
    /** /Handle RAILs Action */


    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindDataTables();
        bindForms();
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWBaseStation = window.VWBaseStation || {}));