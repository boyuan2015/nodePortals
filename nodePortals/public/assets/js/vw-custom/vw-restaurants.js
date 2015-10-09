/*********************
*   VW Restaurants   *
*********************/
(function ($, VWRestaurants, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idDtRestaurants: 'dt-restaurants',
        idPanelBodyRestaurants: 'panelBodyRestaurants',
        classAExpand: 'a-expand',
        classPlusIcon: 'fa-plus-square-o',
        classMinusIcon: 'fa-minus-square-o',
        classSpinnerIcon: 'fa-spinner',
        classContainerDataTable: 'container-data-table',
        classTrNoHover: 'tr-no-hover',
        classBtnDeleteRestaurant: 'btn-delete-restaurant',
        urlShowCompanyChildrenInline: '/company/{id}/children',
        urlDeleteRestaurant: '/restaurant/{id}',
        objSpinner: null,
        intSpinnerRemoveDelay: 0,
        textConfirmationRequired: 'Confirmation Required',
        textActionDescriptionBase: 'Would you like to {0} this item \'{1}\'?',
        textMessageDelete: 'Delete'
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/
    
    /** Bind DataTable */
    var bindDataTable = function(selector, showExtras) {

        if($(selector).length){

            var showExtrasVal = true;
            if(showExtras !== undefined){
                showExtrasVal = showExtras;
            }

            // Loading Spinner
            settings.objSpinner = VWUtility.createSpinner('.' + settings.classContainerDataTable);

            // DataTable
            var $oTable = $(selector);

            // DataTable Draw Callback
            var dataTableDrawCallback = function(){

                // Row Expand or Collapse
                $oTable.find('.' + settings.classAExpand).off().on({
                    click: function(){
                        handleRestaurantsRowExpandOrCollapse(this, $oTable);
                    }
                });
                // Restaurant Delete
                $oTable.find('.' + settings.classBtnDeleteRestaurant).off().on({
                    click: function(){

                        var $btn = $(this);
                        var restaurantName = $btn.data('restaurant-name');
                        var messageIntro = '<strong>Restaurant - ' + settings.textConfirmationRequired + '</strong><br />';

                        bootbox.confirm(messageIntro + settings.textActionDescriptionBase.format({ 0: settings.textMessageDelete, 1: restaurantName }), function (result) {
                            if (result) {

                                settings.objLadda = Ladda.create($btn.get(0));
                                settings.objLadda.start();

                                var id = $btn.data('restaurant-id');
                                var $row = $btn.parents('tr');
                                deleteRestaurant(id, $row);
                            }
                        });
                    }
                });
            };

            $oTable.dataTable({
                'bFilter': showExtrasVal,
                'bInfo': showExtrasVal,
                'bPaginate': showExtrasVal,
                'aaSorting': [[1, 'asc']],
                'aoColumns': [
                    { 'bSortable': false },
                    null,
                    null,
                    { 'bSortable': false }
                ],
                'drawCallback': function () {
                    dataTableDrawCallback();
                },
                'initComplete': function(tblSettings, tblJson) {
                    setTimeout(function(){

                        // Loading Spinner remove & show data-table
                        VWUtility.resetSpinner(settings.objSpinner);
                        $('.' + settings.classContainerDataTable).css('visibility', 'visible');
                    }, settings.intSpinnerRemoveDelay);
                }
            });

        }else{
            $('.' + settings.classContainerDataTable).css('visibility', 'visible');
        }
    };
    /** /Bind DataTable */

    /** Handle Restaurants Row Expand Or Collapse */
    var handleRestaurantsRowExpandOrCollapse = function($oA, $oTable){

        var nTr = $($oA).parents('tr')[0];
        var id = $(nTr).data('id');
        if ($oTable.fnIsOpen(nTr)) {

            //$(nTr).removeClass(settings.classTrNoHover);

            $($oA).find('i').addClass(settings.classPlusIcon);
            $($oA).find('i').removeClass(settings.classMinusIcon);
            $oTable.fnClose(nTr);

        }else{

            //$(nTr).addClass(settings.classTrNoHover);

            $($oA).find('i').addClass(settings.classSpinnerIcon);
            $($oA).find('i').removeClass(settings.classPlusIcon);

            $.ajax({
                url: settings.urlShowCompanyChildrenInline.replace('{id}', id.toString()),
                type: "GET",
                dataType: "html",
                data: { id: id },
                success: function (data) {

                    $($oA).find('i').addClass(settings.classMinusIcon);
                    $($oA).find('i').removeClass(settings.classSpinnerIcon);
                    $oTable.fnOpen(nTr, data, 'details');

                    if($(data).find('table').hasClass('dt-data')){
                        bindDataTable('#' + $(data).find('table').attr('id'), false);
                    }
                },
                error: function (data) {

                    $($oA).find('i').addClass(settings.classPlusIcon);
                    $($oA).find('i').removeClass(settings.classSpinnerIcon);
                }
            });
        }
    }
    
    /** /Handle Restaurants Row Expand Or Collapse */

    /** Delete Restaurant */
    var deleteRestaurant = function(restaurantIdVal, row){

        $.ajax({
            type: 'POST',
            url: (settings.urlDeleteRestaurant.replace('{id}', restaurantIdVal)),
            data: { _method: 'DELETE' },
            dataType: "json",
            success: function (jsonData) {
                if ((jsonData != null) && (jsonData.success)) {

                    row.remove();

                    VWUtility.showDismissibleAlert('#' + settings.idPanelBodyRestaurants, VWUtility.getAlertTypes().ALERT_TYPE_SUCCESS,
                        'Success:', 'Deleted the Restaurant.');

                } else if (jsonData != null) {

                    // Error #1
                    VWUtility.showDismissibleAlert('#' + settings.idPanelBodyRestaurants, VWUtility.getAlertTypes().ALERT_TYPE_DANGER,
                        'Error:', 'Problem deleting Restaurant (' + jsonData.status + ').');
                    VWUtility.resetLadda(settings.objLadda);
                }
            },
            error: function () {
                // Error #2
                VWUtility.resetLadda(settings.objLadda);
            }
        });
    };
    /** /Delete Restaurant */


    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindDataTable('#' + settings.idDtRestaurants);
    };
    /* /Init */
    
    // Init _self
    init();
    
}(jQuery, window.VWRestaurants = window.VWRestaurants || {}));