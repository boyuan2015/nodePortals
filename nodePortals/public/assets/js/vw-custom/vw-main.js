/****************
*   VW Main    *
*****************/
(function ($, VWMain, undefined) {
    
    /*** GLOBALS ***/
    
    /* Settings */
    var settings = {
        idLiSelectedRestaurant: 'liSelectedRestaurant',
        classBtnLaddaAuto: 'btn-ladda-auto',
        textSelectedRestaurantIdDefault: '0',
        textSelectedRestaurantNameDefault: 'None Selected',
        urlSelectedRestaurant: '/restaurant/selectedRestaurant',
        urlSelectedRestaurantPermission: '/restaurant/selectedRestaurantPermission',
        urlLogin: '/account/login',
        urlReset: '/account/reset/'
    };
    /* /Settings */


    /*** PRIVATE METHODS ***/
    
    /** Bind Global Behaviors */
    var bindGlobalBehaviors = function() {

        // Tooltips
        $('.vw-tooltip').tooltip();

        // jQuery Validation Defaults
        $.validator.setDefaults({
            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'help-block',
            errorPlacement: function(error, element) {
                if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            }
        });
        //>

        // Button Ladda Auto
        $('.' + settings.classBtnLaddaAuto).on({
           click: function(){
               var objLadda = Ladda.create($(this).get(0));
               objLadda.start();
           }
        });
        //>
    };
    /** /Bind Global Behaviors */

	/** Try to get the selected restaurant via Ajax */
	var getSelectedRestaurant = function() {

        if((window.location.href.indexOf(settings.urlLogin) === -1)
            && (window.location.href.indexOf(settings.urlReset) === -1)){

            var name = settings.textSelectedRestaurantNameDefault;
            var id = settings.textSelectedRestaurantIdDefault;

            $.getJSON(settings.urlSelectedRestaurant, function(data) {

                if(data.hasOwnProperty('name') && data.hasOwnProperty('id')){
                    name = data.name;
                    id = data.id;
                    
                    getSelectedRestaurantPermission();
                }

            }).always(function(){
                selectedRestaurant(name, id);
            });
        }
	}
	/** /Try to get the selected restaurant via Ajax */
	
	/** Try to get the selected restaurant's permission via Ajax */
	var getSelectedRestaurantPermission = function() {
		
        if((window.location.href.indexOf(settings.urlLogin) === -1)
            && (window.location.href.indexOf(settings.urlReset) === -1)){

            $.getJSON(settings.urlSelectedRestaurantPermission, function(data) {

				permissions = data;

            }).always(function(){
				
				showHideMenuFromPermission();

            });
        }
	}
	/** /Try to get the selected restaurant via Ajax */
	
	/** Helper function to check the current user and selected restaurant's permission */
	permissions = null;
	
	var hasPermission = function ( permissionName ) {
		                                                
                // var res = showVariable(this.permissions);                
                // alert(res);
               
		if ( this.permissions == null )
			return false;
				
		if ( this.permissions.indexOf( permissionName ) == -1 )
			return false;
		
		return true;
	}
	/** Helper function to check the current user and selected restaurant's permission */
	
	/** Show / hide menu by using the current permission */
	var showHideMenuFromPermission = function () {
		showHideMenu( 'liSelectedRestaurantEdit', hasPermission( 'Restaurants_Update' ) && hasPermission( 'Restaurants_GetTipSettings' ) );
		showHideMenu( 'liRestaurantSurvey', hasPermission( 'Surveys_ByRestaurant' ) );
		showHideMenu( 'liScheduledSurvey', hasPermission( 'Surveys_GetSchedulesByDateRange' ) && hasPermission( 'Surveys_ByRestaurant' ) );
		showHideMenu( 'liAddSurvey', hasPermission( 'Surveys_Create' ) && hasPermission( 'Surveys_CreateSchedule' ) );
		showHideMenu( 'liPos', hasPermission( 'Restaurants_GetPOS' ) );
		showHideMenu( 'liHardware', hasPermission( 'BaseStations_GetDetails' ) && hasPermission( 'Chargers_GetDetails' ) );
		showHideMenu( 'liAddUser', hasPermission( 'Users_Create' ) && hasPermission( 'Restaurants_AddUserToRestaurant' ) );
		showHideMenu( 'liAddExistingUser', hasPermission( 'Restaurants_AddUserToRestaurant' ) );
	}
	/** Show / hide menu by using the current permission */
	
	/** Toggle show/hide menu item */
	var showHideMenu = function ( id, value ) {
		$element = $( '#' + id );		
		if ( value )
		{
			$element.show();
			return true;
		}
		
		$element.hide();
		return false;
	}
	/** Toggle show/hide menu item */

    /** Select Restaurant */
    var selectedRestaurant = function(name, id)
    {
        var $liSelectedRestaurant = $('#' + settings.idLiSelectedRestaurant);
        $('#spanSelectedRestaurantName').text(name);
        $('#spanSelectedRestaurantName').attr('data-restaurant-id', id);

        if((name !== settings.textSelectedRestaurantNameDefault)
            && (id !== settings.textSelectedRestaurantIdDefault)) {

            $('#liSelectedRestaurant').off('click');
            $('> a', $liSelectedRestaurant).removeClass('none-selected');
            $liSelectedRestaurant.show();
            $('#aSelectedRestaurantView').prop('href', '/restaurant/'+id);
            $('#aSelectedRestaurantEdit').prop('href', '/restaurant/'+id+'/edit');
            $('#aSelectedRestaurantPosEdit').prop('href', '/pos/'+id+'/edit');
            $('#aSelectedRestaurantUsers').prop('href', '/restaurant/'+id+'/users');

            updateMenuAnchor();
        }else{

            $('> a', $liSelectedRestaurant).addClass('none-selected');
            $liSelectedRestaurant.on({
               click: function(event){
                   event.stopPropagation();
               }
            });
        }
    };
    /** /Select Restaurant */

    /** Deselect Restaurant */
    var deselectRestaurant = function()
    {
        $( '#liSelectedRestaurant').hide();
    }
    /** /Deselect Restaurant */

    /** Bind Global AJAX Handler */
    var bindGlobalAjaxHandler = function(){

        $(document).ajaxError(function( event, jqxhr, settings, exception ) {
            if ( jqxhr.status === 401 ) {
                handleLoginModalPromptRedirect();
            }
        });
    };
    /** /Bind Global AJAX Handler */

    /** Handle Login Modal Prompt Redirect */
    var handleLoginModalPromptRedirect = function(){

        var messageIntro = '<strong>Sorry, your session has expired!</strong><br />';
        var messageBody = 'If you would like to sign in to the system again, click \'OK\'.';
        bootbox.alert(messageIntro + messageBody, function () {
            window.location = settings.urlLogin;
        });
    };
    /** /Handle Login Modal Prompt Redirect */


    /*** PUBLIC METHODS ***/
    

    /*** CONSTRUCTOR ***/
    
    /* Init */
    var init = function() {

        bindGlobalAjaxHandler();
        bindGlobalBehaviors();
        getSelectedRestaurant();
    };
    /* /Init */
    
    // Init _self
    init();

}(jQuery, window.VWMain = window.VWMain || {}));