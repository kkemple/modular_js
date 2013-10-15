/**
 * ## The Application Framework API
 * - This layer is responsible for interacting with the core layer
 * - This layer acts as an API between the module and core layers
 *
 * **For API documentation see the MOD.sandbox.return class API**
 *
 * @class  sandbox
 * @namespace MOD
 * @static
 */

MOD.sandbox = {

	/**
	 * Responsible for the creatation of a sandbox instance, it returns an object with the Sanbox API so that the module instance can communicate with the core. This function is only used in the core to create instances in the create_module function for testing and in the start function for starting up an instance of the actual module
	 *
	 * 	MOD.sandbox.create( MOD.core, 'my-module' ); // this function is called in the core and should not be called anywhere
	 *
	 * @param  {Object} core     the MOD.core object, this is how the instance of the sandbox can access the core
	 * @param  {string} moduleID the ID of the module being created, this ID needs to correspond to an ID on a DOM element, this element will be the top level element of the module and all functionality will be restricted to within this parent element
	 * @return {Object}          the Sandbox instance (API) for the module instance to use
	 * @method  create
	 * @private
	 */
	create : function ( core, moduleID ) {

		/**
		 * the top level DOM element of the module, this is actually a property of the create method
		 * @property {object} CONTAINER
		 * @private
		 */
		var CONTAINER = core.dom.query( '#' + moduleID );

		/**
		 * Our return object containing all the functionality a module will need to communicate with core and other modules.
		 * ##### All method examples will demonstrate how to use the Sandbox from the modules
		 *
		 * @class  return
		 * @namespace MOD.sandbox
		 */
		return {

			/**
			 * Query function for getting elements within our module. This returns a jQuery like object that contains the following properties:
			 *
			 * - length: for looping
			 * - query : function for looking within the returned element for more elements
			 *
			 *
			 * 	var elems = sb.find( '.my-class' );
			 *
			 * 	var len = elems.length,
			 * 	var innerEls = elems.query( '.inner-elems' );
			 *
			 * 	// you can loop the returned object to access individual elements
			 * 	for ( var i = 0, i < len; i++ ) {
			 * 		doSomething( elems[ i ] );
			 * 	}
			 *
			 * 	// you can also access directly
			 * 	var singleEl = elems[0];
			 *
			 *
			 * @param  {string} selector the CSS selector of the element(s) to find
			 * @return {object}          a jQuery like object with the requested elements
			 * @method  find
			 * @public
			 */
			find : function ( selector ) {
				return CONTAINER.query( selector );
			},

			/**
			 * Used to add events to elements within our module, such as click, mousenter, etc..
			 *
			 *
			 * 	var btn = sb.find( '.search-btn' )[0];
			 *
			 * 	sb.add_event( btn, 'click', this.search );
			 *
			 *
			 * @param {object}   el  the DOM element to add the evt to
			 * @param {string}   evt the type of event to add
			 * @param {Function} fn  the function to execute when event is triggered
			 * @return {none}
			 * @method  add_event
			 * @public
			 */
			add_event : function ( el, evt, fn ) {
				core.dom.bind( el, evt, fn );
			},

			/**
			 * Used to remove events from elements within our module
			 *
			 * 	sb.remove_event( btn, 'click', this.search );
			 *
			 *
			 * @param  {object}   el  the DOM element to remove the event from
			 * @param  {string}   evt the event to remove
			 * @param  {Function} fn  the function to remove
			 * @return {none}
			 * @method  remove_event
			 * @public
			 */
			remove_event : function ( el, evt, fn ) {
				core.dom.unbind( el, evt, fn );
			},

			/**
			 * The custom method for broadcasting custom events
			 *
			 * 	var evt = {
			 * 		type : 'search-results-returned',
			 * 		data : sb.get_value( btn )
			 * 	}
			 *
			 * 	sb.notify( evt );
			 *
			 *
			 * @param  {object} evt the event object containing the event name and the data to send with it
			 * @return {none}
			 * @method  notify
			 * @public
			 */
			notify : function ( evt ) {
				core.trigger_event( evt );
			},

			/**
			 * The custom method for responding to custom events. The object you pass to the listen method is set up with properties with the name of the events to listen to, and the value of those properties is the function to run when the event is fired
			 *
			 * 	sb.listen({
			 * 		'search-results-returned' : function ( data ) {
			 *
			 * 			// do something with data passed with event notification
			 * 			alert( data.message );
			 * 		},
			 * 		'another-event-to-listen-to' : function ( data ) {
			 * 			// do something with data from other event
			 * 		}
			 * 	});
			 *
			 *
			 * @param  {object} evts the event(s) to listen for
			 * @return {none}
			 * @method  listen
			 * @public
			 */
			listen : function ( evts ) {
				core.register_events( evts, moduleID );
			},

			/**
			 * The custom method for removing custom listeners
			 *
			 * 	var evts = [ 'search-results-returned', 'another-event-to=listen-to' ];
			 *
			 * 	sb.ignore( evts, 'my-module' );
			 *
			 *
			 * @param  {array} evts     the events to unregister
			 * @param  {string} moduleID the ID of the module to remove listeners from
			 * @return {none}
			 * @method  ignore
			 * @public
			 */
			ignore : function ( evts, moduleID ) {
				core.remove_events( evts, moduleID );
			},

			/**
			 * Used to create an element including children elements and apply attrs to those elements
			 *
			 *	var config = {
			 * 		el : 'div',
			 * 		attrs : {
			 * 			'id' : 'awesome',
			 * 			'class' : 'framework'
			 * 		},
			 * 		children : [
			 * 			{
			 * 				el : 'p',
			 * 				text : 'This framework is awesome!!',
			 * 				attrs : {
			 * 					'class' : 'shout-it-out'
			 * 				}
			 * 			}
			 * 		]
			 * 	};
			 *
			 * 	sb.create_element( config );
			 *
			 * @param  {object} config the settings of the element including attrs and children
			 * @return {object}        the element that was created
			 * @method  create_element
			 * @public
			 */
			create_element : function ( config ) {
				return core.dom.create( config );
			},

			/**
			 * Append elements to an element within the module
			 *
			 * 	var parent = sb.find( '#parent' )[0];
			 * 	var el = sb.create_element( config );
			 *
			 * 	sb.append( parent, el );
			 *
			 *
			 * @param  {object} el    the element to append to
			 * @param  {array, object, string} elems the elements to append
			 * @return {none}
			 * @method  append
			 * @public
			 */
			append : function ( el, elems ) {
				core.dom.append_elems( el, elems );
			},

			/**
			 * Prepend elements to an element within the module
			 *
			 * 	var parent = sb.find( '#parent' )[0];
			 * 	var el = sb.create_element( config );
			 *
			 * 	sb.prepend( parent, el );
			 *
			 *
			 * @param  {object} el    the element to prepend to
			 * @param  {array, object, string} elems the elements to prepend
			 * @return {none}
			 * @method  prepend
			 * @public
			 */
			prepend : function ( el, elems ) {
				core.dom.prepend_elems( el, elems );
			},

			/**
			 * Used for all ajax requests
			 *
			 * 	var config = {
			 *  		url : 'http://someurl.com/get/the/awesome/json',
			 *  		type : 'GET',
			 *  		dataType : 'JSON',
			 *  		data : {
			 *  			some : 'data',
			 *  			more : 'data'
			 *  		},
			 *  		done : function( response ) {
			 *    			// do something with successful results
			 * 		},
			 * 		fail : function( error ) {
			 * 			// do something with unseccessful ajax request
			 * 			alert( error.message );
			 * 		},
			 * 		scope : this   // set the scope for the callback functions
			 * 	}
			 *
			 * 	sb.request( config );
			 *
			 *
			 * @param  {object} config the configuration including url, data, and done and fail functions
			 * @return {none}
			 * @method request
			 * @public
			 */
			request : function ( config ) {
				core.util.ajax( config );
			},

			/**
			 * This function is responsible for handling all modifications to an element
			 *
			 * **Available actions are:**
			 *
			 * - 'add-class' - takes a string value
			 * - 'remove-class' - takes a string value
			 * - 'styles' - takes an object of values ( like jQuery .css() method )
			 * - 'attr' - takes an object of values ( like jQuery .attr() method )
			 *
			 *
			 * 	// add-class action
			 * 	var el = sb.find( '.element' )[0];
			 * 	sb.modify( el, 'add-class', 'new-class' );
			 *
			 *
			 * 	// remove-class action
			 * 	var el = sb.find( '.element' )[0];
			 * 	sb.modify( el, 'remove-class', 'new-class' );
			 *
			 *
			 * 	// styles action
			 * 	var el = sb.find( '.element' )[0];
			 * 	var css = {
			 * 		'color' : '#444',
			 * 		'background' : '#f7f7f7',
			 * 		'padding' : '20px'
			 * 	};
			 * 	sb.modify( el, 'styles', css );
			 *
			 *
			 * 	// attr action
			 * 	var el = sb.find( '.element' )[0];
			 * 	var attrs = {
			 * 		'id' : 'profile-thumbnail',
			 * 		'src' : 'http://someurl.to/the/thumbnail',
			 * 		'width' : '45',
			 * 		'height' : '45',
			 * 		'data-hover' : 'true'
			 * 	};
			 * 	sb.modify( el, 'styles', css );
			 *
			 *
			 * @param  {object} el     the element to modify
			 * @param  {string} action the action to perform
			 * @param  {string, object} value  the value(s) to apply, could be a string or object
			 * @return {none}
			 * @method  modify
			 * @public
			 */
			modify : function ( el, action, value ) {
				switch ( action ) {
					case 'add-class':
						core.dom.add_class( el, value );
					break;
					case 'remove-class':
						core.dom.remove_class( el, value );
					break;
					case 'styles':
						core.dom.style( el, value );
					break;
					case 'attr':
						core.dom.apply_attrs( value );
					break;
				}
			},

			/**
			 * Gets or sets a single property on an element
			 * @param  {object} el    the DOM element to update
			 * @param  {string} prop  the property or attribute to update/retrieve
			 * @param  {string} value if setting, the value to apply to the property/attribute
			 * @return {none}
			 * @method attr
			 * @public
			 */
			attr : function( el, prop, value ) {
				core.dom.prop( el, prop, value );
			},

			/**
			 * returns x and y coords of the offset of the element relative to the document
			 *
			 * 	var offset = sb.offset( el );
			 *
			 * 	window.scrollTo( 0, offset.y );
			 *
			 *
			 * @param  {object} el the DOM element you want the offset of
			 * @return {object}    object containing x and y coords
			 * @method  offset
			 * @public
			 */
			offset : function( el ) {
				return core.dom.offset( el );
			},

			/**
			 * Checks a DOM element for a specified class
			 *
			 * 	if ( sb.has_class( el, 'some-class' ) ) {
			 * 		// do something if has class
			 * 	} else {
			 * 		// do something if doesn't have class
			 * 	}
			 *
			 *
			 * @param  {object}  el            the DOM element to check
			 * @param  {string}  class_to_find the class to look for
			 * @return {Boolean}               true if has class / else false
			 * @method  has_class
			 * @public
			 */
			has_class : function ( el, class_to_find ) {
				return core.dom.has_class( el, class_to_find );
			},

			/**
			 * Handles all animations of DOM elements
			 *
			 * 	var el = sb.find( '#dialog' );
			 *
			 * 	var props = {
			 * 		opacity : 0.6,
			 * 		top : 30
			 * 	};
			 *
			 * 	sb.animate( el, props, 600, someFunction, this );
			 *
			 *
			 * @param  {object}   el       the element(s) to animate
			 * @param  {object}   value    the object of css properties to animate
			 * @param  {integer}   duration the amount of the time that should pass until animation is complete ( in ms )
			 * @param  {Function} callback the callback if any to call when animation is complete
			 * @param {object} scope  the scope of the callback method
			 * @return {none}
			 * @method  animate
			 * @public
			 */
			animate : function ( el, value, duration, callback, scope ) {
				core.dom.animate( el, value, duration, callback, scope );
			},

			/**

			* Perform a function on each member of an array
			*
			* 	// get values of multiselect
			*
			* 	var elems = sb.find( 'select option' ),
			* 		values = [];
			*
			* 	values = sb.foreach( elems, function( item, index ) {
			*  		if ( item.selected === true ) {
			*  			return item.value;
			*  		}
			* 	}, this );
			*
			*
			* @param  {array}   arr   the array of items to loop over
			* @param  {Function} fn    the function to run on each item
			* @param  {object}   scope the scope of the function that is running
			* @return {array}         an array of the returned results from original array, if anything is returned from callback function
			* @method  foreach
			* @puclic
			*/
			foreach : function( arr, fn, scope ) {
				return core.util.map( arr, fn, scope );
			}
		};
	}
};
