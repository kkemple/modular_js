/* ModJS
 * 2013-10-25
 * Author: Kurtis Kemple
 * Email: kurtiskemple@gmail.com
 * URL: http://kurtiskemple.com
 */

/**
 * The application namespace.
 * @module MOD
 */
var MOD = {};

/**
 * ## The Application Framework Core
 * This layer is the actual core of the framework. It contains all utitity functions such as dom functions, and assistive functions such as array checks, mapping, and any other functions that are used to assist in faster development of JS. It is the only layer that can communicate with the Base layer, and it is only accessed by the Sandbox layer.
 *
 * - This layer is responsible for communication with the Base layer
 * - All business logic is executed here
 * - Returns an object with the necessary functions for handling modules
 * >For docs on the return object see the MOD.core.return class docs
 *
 * ##### No core method should ever be called from a module, core methods should only be called from the MOD.app object for initialization and the MOD.sandbox object for business logic
 *
 *
 * @class core
 * @namespace  MOD
 * @static
 */
MOD.core = (function () {

	// module_data will be our storage for all information pertaining to our modules
	var module_data = {},
		root = this;

	/**
	 * The MOD.core.util object handles all logic operations and helps with application-wide common tasks, this would be mapping arrays, making ajax requests, etc... These functions should only be accessed by the sandbox, **never in the module!!**
	 * @class util
	 * @namespace MOD.core
	 */
	this.util = {

		debug : true,

		/**
		 * this function handles all custom logging, supports debug mode which logs to console, or non-debug which allows you to send logs to the server
		 *
		 * 	MOD.core.util.log( 1, 'LOG : ERROR: "There was an error"' );
		 *
		 *
		 * @param  {int} severity the level of severity
		 * @param  {string} message  the message to log
		 * @return {none}
		 * @method  log
		 * @private
		 */
		log : function ( severity, message ) {

			if ( this.debug ) {

				console[ ( severity === 1 ) ? 'log' : ( severity === 2 ) ? 'warn' : 'error' ]( message );
			} else {

				// add code for sending errors to server...need to discuss how to implement
			}
		},

		/**
		 * Converts anything to a string
		 *
		 * 	MOD.core.util.to_sting( some_unknown_value );
		 *
		 *
		 * @param  {anything} anything can literally pass in anything
		 * @return {string}          string version of passed in parameter
		 * @method  to_string
		 * @private
		 */
		to_string : function ( anything ) {
			return anything.toString();
		},

		/**
		 * Trim starting and trailing whitespace from an object
		 *
		 * 	var str = "   This is a messy string.   ";
		 *
		 * 	str = MOD.core.util.trim( str );
		 *
		 * 	// Returns: "This is a messy string."
		 *
		 *
		 * @param  {String} str the string to trim whitespace from
		 * @return {String} cleaned up string
		 * @method  trim
		 * @private
		 */
		trim: function ( str ) {
			return str.replace( /^\s+/, '' ).replace( /\s+$/, '' );
		},

		/**
		 * Converts dash-seperated words to camelCase, see what I did there =]
		 * @param  {String} str the string to camel case
		 * @param  {String} splitter either space or dash
		 * @return {String} camel cased string
		 * @method  to_camel_case
		 * @private
		 */
		to_camel_case: function( str, splitter ) {
			var regex;

			switch ( splitter ) {
				case ' ':
					splitter = '\\s';
				break;
				default:
					splitter = '-';
				break;
			}

			regex = new RegExp( splitter + '([a-z])', 'gi' );

			return str.replace( regex, function( all, letter ) {

				return letter.toUpperCase();
			});
		},

		/**
		 * Checks for the type of whatever is passed in, if it is an object returns true
		 *
		 * 	MOD.core.util.is_object( some_unknown_value );
		 *
		 *
		 * @param  {unknown}  anything the var to check for type of object
		 * @return {Boolean}          true if object, else false
		 * @method  is_object
		 * @private
		 */
		is_object : function ( anything ) {
			return ( typeof anything === 'object' && ( Object.prototype.toString.call( anything ) === '[object Object]' ) ) ? true : false;
		},

		/**
		 * Checks for the type of whatever is passed in, if it is an array returns true
		 *
		 * 	MOD.core.util.is_array( some_unknown_value );
		 *
		 *
		 * @param  {unknown}  anything the var to check for type of array
		 * @return {Boolean}          true if array, else false
		 * @method  is_array
		 * @private
		 */
		is_array : function ( anything ) {
			return ( typeof anything === 'object' && ( Object.prototype.toString.call( anything ) === '[object Array]' ) ) ? true : false;
		},

		/**
		 * Checks an array for a given value
		 * @param  {array} arr   the array to search through
		 * @param  {anything} value the value to look for
		 * @return {boolean}       true if array contains value, else false
		 * @method  array_contains
		 * @private
		 */
		array_contains : function ( arr, value ) {
			var i = 0, len = arr.length;

			if ( typeof arr !== 'object' && Object.prototype.toString.call( arr ) !== '[object Array]' ) {

				this.log( 1, 'ARRAY : CONTAINS : FAILED : "Array argument is of wrong type"' );
				return;
			}

			for( ; i < len; ) {

				if( arr[ i ] === value ) {

					return true;
				}
				++i;
			}
			return false;
		},

		/**
		* Performs a function on each member of an array
		*
		* 	function getText ( item ) {
		* 		return item.text;
		* 	}
		*
		* 	var arr = sb.find( '.some-paragraphs' );
		*
		*	var textArr = MOD.core.util.map( arr, getText, this );
		*
		*
		* @param  {array}   arr the array to map over
		* @param  {Function} fn  the callback to execute for each array item
		* @return {array}       the results of the mapping if anything is returned in the callback function
		* @method map
		* @private
		*/
		map : function( arr, fn, scope ) {
			var ret = [], i =0;
			scope = ( scope ) ? scope : null;

			if ( typeof fn === 'function' ) {

				while ( arr[ i ] ) {

					ret.push( fn.call( scope, arr[ i ], i ) );
					++i;
				}

				return ret;
			} else {

				this.log( 1, 'UTIL : MAP : FAILED : "One or more arguments are of wrong type"' );
			}
		},

		/**
		 * Handles all ajax requests for the application
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
		 * 	MOD.core.util.ajax( config );
		 *
		 *
		 * @param  {object} config the configuration for the ajax request including callbacks
		 * @return {none}
		 * @method ajax
		 * @private
		 */
		ajax : function ( config ) {
			if ( config && config.url
					&& config.scope
					&& config.done
					&& config.fail ) {

				var request = jQuery.ajax({
					url : config.url,
					data : config.data,
					type : ( config.type ) ? config.type : 'GET',
					dataType : ( config.dataType ) ? config.dataType : 'JSON'
				});

				// handle a successful ajax request
				request.done( function ( response ) {
					config.done.call( config.scope, response );
				});

				// handle a failed ajax request
				request.fail( function ( jqXHR, textStatus ) {
					var error = {
						message : textStatus,
						XHR : jqXHR
					};

					config.fail.call( config.scope, error );
				});
			} else {

				this.log( 1, 'AJAX : FAILED : "Incomplete config for request, see docs for full config example"' );
			}
		},

		/**
		 * Check to see if browser is specified version of IE or lower
		 *
		 * 	if ( MOD.core.util.isIE( 8, userAgent ) ) {
		 * 		// Do something because browser is IE8 or lower
		 * 	}
		 *
		 *
		 * @param  {Number}  version the highest version of Internet Explorer to test for
		 * @param  {String}  userAgent the user agent to test against
		 * @return {Boolean} true/false
		 * @method  isIE
		 * @private
		 */
		isIE: function ( version, userAgent ) {

			function getInternetExplorerVersion () {
				var rv = -1;   // Return value assumes failure.

				var ua = userAgent;
				var re  = new RegExp( /MSIE ([0-9]{1,}[\.0-9]{0,})/ );

				if ( re.exec( ua ) !== null ) {
					rv = parseFloat( RegExp.$1 );
				}

				return rv;
			}

			var ie = false,
				ver = getInternetExplorerVersion();

			if ( ver > -1 && ( (version && ver <= version) || !version ) ) {

				ie = true;
			}

			return ie;
		}
	};

	/**
	 * The MOD.core.dom object handles all DOM interaction, if it affects the page it should happen here. These functions should only be accessed by the sandbox, **never in the module!!**
	 * @class dom
	 * @namespace MOD.core
	 */
	this.dom = {

		/**
		 * The main query function, ties in to base to find elements. This function is the base for all DOM searching
		 *
		 * 	var CONTAINER = MOD.dom.query( '#' + moduleID );
		 *
		 *
		 * @param  {string} selector the CSS selector of the requested elements
		 * @param  {object} context  the object to look within for the selected items
		 * @return {object}          jQuery like object of the DOM elements, just with less power
		 * @method  query
		 * @private
		 */
		query : function ( selector, context ) {
			var ret = {}, elems;

			// check to see if context is set, if so find elements within context, else find elems in DOM
			if ( context && context.find ) {

				elems = context.find( selector );
			} else {

				elems = jQuery( selector );
			}

			// set ret to the DOM elements from the elems jQuery object
			ret = elems.get();

			// add a length property to the object so it can be easily iterated over
			ret.length = elems.length;

			// return a query function that allows the module to search within itself for child elements
			ret.query = function ( sel ) {
				return root.dom.query( sel, elems );
			};

			return ret;
		},

		/**
		 * Attach events to elements within the module such as 'click', 'mouseenter', etc...
		 *
		 * 	MOD.core.dom.bind( btn, 'click', someFunction );
		 *
		 *
		 * @param  {string}   elem the element that we are attaching to
		 * @param  {string}   evt the event type we want to attach
		 * @param  {Function} fn the function we want to execute
		 * @return {none}
		 * @method bind
		 * @private
		 */
		bind : function ( elem, evt, fn ) {
			if ( elem && typeof evt === 'string' ) {

				jQuery( elem ).on( evt, fn );
			} else {

				root.util.log( 2, 'Event "' + evt + '" : Attachment : FAILED : "Event attachment to element: ' + elem + ' failed."' );
			}
		},

		/**
		 * Remove events on elements within the module such as 'click', 'mouseenter', etc...
		 *
		 * 	MOD.core.dom.unbind( btn, 'click', someFunction );
		 *
		 *
		 * @param  {string}   elem the element that we are removing the event on
		 * @param  {string}   evt the event type we want to remove
		 * @param  {Function} fn the function we want to remove
		 * @return {none}
		 * @method unbind
		 * @private
		 */
		unbind : function ( elem, evt, fn ) {
			if ( elem && typeof evt === 'string' ) {

				jQuery( elem ).off( evt, fn );
			} else {

				root.util.log( 2, 'Event "' + evt + '" : Removal : FAILED : "Event removal on element: ' + elem + ' failed."' );
			}
		},

		/**
		 * Create a new DOM element and apply any attributes or create any child elements
		 *
		 * 	var config = {
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
		 * 	var el = MOD.core.dom.create( config );
		 *
		 *
		 * @param  {object} config element type to create
		 * @return {object}    DOM object that was created
		 * @method  create
		 * @private
		 */
		create : function ( config ) {
			var el, child;


			// check for any config settings
			if ( config && config.el ) {

				// create our top level element
				el = document.createElement( config.el );

				// check to see if our element has any text associated with it
				if ( config.text ) {
					el.appendChild( document.createTextNode( config.text ) );
				}

				// check for an attr property, also do sanity check
				if ( config.attrs ) {
					if ( root.util.is_object( config.attrs ) ) {

						root.dom.apply_attrs( el, config.attrs );
					} else {

						root.log( 1, 'CREATE : ELEMENT : FAILED : "config.attrs is of wrong type' );
					}
				}

				// check for children property, also do sanity check
				if ( config.children ) {

					if ( root.util.is_array( config.children ) ) {

						var i = 0, len = config.children.length;

						// loop over our children array and build them,
						// also append them to parent element
						for ( ; i < len; ) {

							child = root.dom.create( config.children[ i ] );

							if ( config.children[ i ].attrs ) {
								root.dom.apply_attrs( child, config.children[ i ].attrs );
							}

							el.appendChild( child );

							++i;
						}
					} else {

						root.util.log( 1, 'CREATE : ELEMENT : FAILED : "config.children is of wrong type"' );
					}
				}
			} else {

				root.util.log( 1, 'CREATE : ELEMENT : FAILED : "Incorrect configuration for element creation"' );
				return false;
			}

			config = null;

			return el;
		},

		/**
		 * Add attributes to an element like src, href, etc...
		 *
		 * 	var attrs = {
		 * 		'src' : http://someurl.com/awesome/image.jpg,
		 * 		'class' : 'awesome-img'
		 * 	};
		 *
		 * 	MOD.core.dom.apply_attrs( img, attrs );
		 *
		 *
		 * @param  {object} el    the element to apply the attrs to
		 * @param  {object} attrs the attrs to apply
		 * @return {none}
		 * @method apply_attrs
		 * @private
		 */
		apply_attrs : function ( el, attrs ) {
			if ( root.util.is_object( attrs ) ) {

				for ( var key in attrs ) {
					if ( attrs.hasOwnProperty( key ) ) {
						el.setAttribute( key, attrs[ key ] );
					}
				}
			} else {
				root.util.log( 1, 'APPLY ATTRIBUTES : FAILED : "Attributes argument is of wrong type."' );
			}
		},

		/**
		 * Gets or sets a single property on an element
		 * @param  {object} el    the DOM element to update
		 * @param  {string} prop  the property or attribute to update/retrieve
		 * @param  {string} value if setting, the value to apply to the property/attribute
		 * @return {none}
		 * @method prop
		 * @private
		 */
		prop : function( el, prop, value ) {
			if ( value === undefined ) {
				return el.getAttribute( prop );
			} else {
				el.setAttribute( prop, value );
			}
		},

		/**
		 * returns x and y coords of the offset of the element relative to the document
		 *
		 * 	var offset = PIX.core.dom.offset( el );
		 *
		 * 	window.scrollTo( 0, offset.y );
		 *
		 *
		 * @param  {object} el the DOM element you want the offset of
		 * @return {object}    object containing x and y coords
		 * @method  offset
		 * @private
		 */
		offset : function( el ) {
			var offset = (function() {
				if ( window.pageXOffset !== null ) {

					return {
						x : window.pageXOffset,
						y : window.pageYOffset
					};
				} else {
					return {
						x : document.documentElement.scrollLeft,
						y : document.documentElement.scrollTop
					};
				}
			}());

			var box = el.getBoundingClientRect();

			return {
				x : Math.floor( box.left + offset.x ),
				y : Math.floor( box.top + offset.y )
			};
		},

		/**
		 * Update styles on a DOM element
		 * @param  {object} el  the element to style
		 * @param  {object} css the key/value object of css properties
		 * @return {none}
		 * @method  style
		 * @private
		 */
		style : function ( el, css ) {
			var ccProp, prop;

			for ( prop in css ) {

				if ( css.hasOwnProperty( prop ) ) {

					ccProp = root.util.to_camel_case( prop );

					el.style[ ccProp ] = css[ prop ];
				}
			}
		},

		/**
		 * Add a class to an elment within the module
		 *
		 * 	MOD.core.dom.add_class( el, 'class-to-add' );
		 *
		 *
		 * @param {object} el           the element to add the class to
		 * @param {string} class_to_add the class to add
		 * @return {none}
		 * @method  add_class
		 * @private
		 */
		add_class : function ( el, class_to_add ) {
			var classes = class_to_add.split( /\s+/ ),
				className = ' ' + el.className + ' ',
				currentClasses = className.split( /\s+/ ),
				len = classes.length,
				i = 0;

			for ( ; i < len; ) {

				if ( !root.util.array_contains( currentClasses, classes[ i ] ) ) {

					className = className + ' ' + classes[ i ];
				}
				++i;
			}

			el.className = root.util.trim( className );
		},

		/**
		 * Remove a class from an element within the module
		 *
		 * 	MOD.core.dom.remove_class( el, 'class-to-remove' );
		 *
		 *
		 * @param  {object} el              the element to remove the class from
		 * @param  {string} class_to_remove the class to remove
		 * @return {none}
		 * @method  remove_class
		 * @private
		 */
		remove_class : function ( el, class_to_remove ) {
			var classes = class_to_remove.split( /\s+/ ),
				className = ' ' + el.className + ' ',
				len = classes.length,
				i = 0;

			for ( ; i < len; ) {

				className = className.replace( ' ' + classes[ i ] + ' ', ' ' );
				++i;
			}

			el.className = root.util.trim( className );
		},

		/**
		 * Checks a DOM element for a specified class
		 *
		 * 	if ( MOD.core.dom.has_class( el, 'some-class' ) ) {
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
		 * @private
		 */
		has_class : function( el, class_to_find ) {
			var classString = el.className,
				classes = classString.split( /\s+/ );

			if ( root.util.array_contains( classes, class_to_find ) ) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Append elements within the scope of the module, accepts DOM elements or html
		 *
		 * 	var el = MOD.core.dom.create( config );
		 *
		 * 	MOD.core.dom.append_elems( el_to_append_to, el );
		 *
		 *
		 * @param  {object} el    the element to append into
		 * @param  {array} elems the elements to append
		 * @return {none}
		 * @method append_elems
		 * @private
		 */
		append_elems : function( el, elems ) {
			if ( typeof elems === 'string' ) {
				el.innerHTML = el.innerHTML + elems;
			} else {
				el.appendChild( elems );
			}
		},

		/**
		 * Prepend elements within the scope of the module, accepts DOM elements or html
		 *
		 * 	var el = MOD.core.dom.create( config );
		 *
		 * 	MOD.core.dom.prepend_elems( el_to_append_to, el );
		 *
		 *
		 * @param  {object} el    the element to prepend into
		 * @param  {array} elems the elements to prepend
		 * @return {none}
		 * @method  prepend_elems
		 * @private
		 */
		prepend_elems : function( el, elems ) {
			if ( typeof elems === 'string' ) {
				el.innerHTML = elems + el.innerHTML;
			} else {
				el.insertBefore( elems, el.firstChild );
			}
		},

		/**
		 * Handles running any code that needs to be run only after the document has loaded
		 * > Used by the MOD.app object
		 *
		 * 	MOD.core.dom.onready( function () {
		 * 		// do some stuff when the document is loaded
		 * 	});
		 *
		 *
		 * @param  {Function} fn the function(s) to run
		 * @return {none}
		 * @method  onready
		 * @private
		 */
		onready : function ( fn ) {
			jQuery( document ).ready( function () {
				fn.call();
			});
		},

		/**
		 * Handles running any code that needs to be run only after the window has loaded
		 * > Used by the MOD.app object
		 *
		 * 	MOD.core.dom.onload( function () {
		 * 		// do some stuff when the window is loaded
		 * 	});
		 *
		 *
		 * @param  {Function} fn the function(s) to run
		 * @return {none}
		 * @method  onload
		 * @private
		 */
		onload : function ( fn ) {
			jQuery( 'window' ).on( 'load', function () {
				fn.call();
			});
		}
	};


	/**
	 * This is the return object of the core, it is passed in to the sandbox when a module is created. This allows the sandbox to have access to core functions, but prevents the modules from knowing about the core, keeping the code loosely coupled
	 *
	 * @type Object
	 * @class  return
	 * @namespace MOD.core
	 */
	return {
		util : this.util,
		dom : this.dom,

		/**
		 * this is a factory function used to create modules for the application
		 *
		 * 	MOD.core.create_module( 'my-module', function( sb ) {
		 *
		 * 		init : function () {
		 *
		 * 			// handle the creation of the module
		 * 			var btn, input, term;
		 *
		 * 			btn = sb.find( '.my-btn' )[0]   // get the element from the return object
		 * 			input = sb.find( '.my-input' )[0]   // same for the input
		 *
		 * 			sb.add_event( btn, 'click', this.doSomething );
		 * 		},
		 *
		 * 		destroy : function () {
		 *
		 * 			// handle breaking the module down
		 * 			sb.remove_event( btn, 'click', this.doSomething );
		 * 			btn = input = term = null;
		 * 		},
		 *
		 * 		doSomething : function () {
		 *
		 * 			// all functionality goes in to functions that are isolated to the module
		 * 			term = sb.val( input );
		 *
		 * 			sb.notify({
		 * 				type : 'search-initiated',
		 * 				data : term
		 * 			});
		 * 		}
		 * 	});
		 *
		 *
		 * @param  {string} moduleID the reference ID of the module
		 * @param  {function} creator  the function ran to create the instance of the module
		 * @return {Boolean} returns true if module is successfully created, else false
		 * @method  create_module
		 * @public
		 */
		create_module : function( moduleID, creator ) {
			var temp;

			// sanity check for correct types on our params
			if ( typeof moduleID === 'string' && typeof creator === 'function' ) {

				// create a temp instance of our module to ensure it will start correctly when called
				temp = creator( MOD.sandbox.create( this, moduleID ) );
				if ( temp.init
						&& temp.destroy
						&& typeof temp.init === 'function'
						&& typeof temp.destroy === 'function' ) {

					temp = null;
					module_data[ moduleID ] = {
						create: creator,
						instance: null,
						evts: null
					};
					return true;
				} else {

					root.util.log( 1, 'Module : "' + moduleID + '"" : Registration : FAILED : "Instance has either no init or no destroy method"' );
					return false;
				}
			} else {

				root.util.log( 1, 'Module : "' + root.util.to_string( moduleID ) + '"" : Registration : FAILED : "One or more arguments are of wrong type"' );
				return false;
			}
		},

		/**
		 * starts up an instance of a particular module
		 *
		 * 	MOD.core.start( 'my-module' );
		 *
		 *
		 * @param  {string} moduleID the ID of the module to start
		 * @return {Boolean} true if module successfully started, else false
		 * @method start
		 * @private
		 */
		start : function( moduleID ) {
			var mod = module_data[ moduleID ];

			if ( mod ) {

				mod.instance = mod.create( MOD.sandbox.create( this, moduleID ) );
				mod.instance.init();
				return true;
			} else {

				root.util.log( 1, 'Module : "' + moduleID + '"" : Stop : FAILED : "No module by that ID"' );
				return false;
			}
		},

		/**
		 * starts up an instance of all modules
		 *
		 * 	MOD.core.start_all();
		 *
		 *
		 * @return {Boolean} true if all modules are successfully started, else false
		 * @method  start_all
		 * @private
		 */
		start_all : function() {
			var moduleID;

			for ( moduleID in module_data ) {

				if ( module_data.hasOwnProperty( moduleID ) ) {

					if ( !this.start( moduleID ) ) {
						return false;
					}
				}
			}

			return true;
		},

		/**
		 * stops an instance of a running module
		 *
		 * 	MOD.core.stop( 'my-module' );
		 *
		 *
		 * @param  {string} moduleID the ID of the module to stop
		 * @return {Boolean} returns true if module is successfully stopped, else false
		 * @method  stop
		 * @private
		 */
		stop : function( moduleID ) {
			var mod = module_data[ moduleID ];

			if ( mod.instance ) {

				mod.instance.destroy();
				mod.instance = null;
				return true;
			} else {

				root.util.log( 1, 'Module : "' + moduleID + '"" : Stop : FAILED : "No module by that ID or no running module by that ID"' );
				return false;
			}
		},

		/**
		 * stops all instances of modules
		 *
		 * 	MOD.core.stop_all();
		 *
		 *
		 * @return {Boolean} true if all modules are successfully stopped, else false
		 * @method  stop_all
		 * @private
		 */
		stop_all : function() {
			var moduleID;

			for ( moduleID in module_data ) {

				if ( module_data.hasOwnProperty( moduleID ) ) {

					if ( !this.stop( moduleID ) ) {
						return false;
					}
				}
			}

			return true;
		},

		/**
		 * add events to our module, events allow for cross module communication
		 *
		 * 	var evts = {
		 * 		'some-event' : function ( data ) {
		 * 			// do something with passed in event data
		 * 		},
		 *
		 * 		'some-other-event' : function ( data ) {
		 * 			// handle a different event
		 * 		}
		 * 	};
		 *
		 * 	MOD.core.register_events( evts, 'my-module' );
		 *
		 *
		 * @param  {object} evts     the events and other data associated to add to module
		 * @param  {string} moduleID the ID of the module to add them to
		 * @return {Boolean} true if events successfully added, else false
		 * @method  register_events
		 * @private
		 */
		register_events : function( evts, moduleID ) {
			if ( this.util.is_object( evts ) &&  moduleID ) {

				var mod = module_data[ moduleID ];

				if (  mod ) {

					mod.evts = evts;
					return true;
				} else {

					root.util.log( 1, 'Module : "' + moduleID + '"" : Register Events : FAILED : "No module by that ID"' );
					return false;
				}
			} else {

				root.util.log( 1, 'Module : "' + moduleID + '"" : Register Events : FAILED : "One or more arguments are of wrong type' );
				return false;
			}
		},

		/**
		 * responsible for checking modules this event and then executing it if it is found
		 *
		 * 	var evt = {
		 * 		'some-event' : data
		 * 	}
		 *
		 * 	MOD.core.trigger_event( evt );
		 *
		 *
		 * @param  {object} evt the event object with type and data
		 * @return {Boolean} returns true if function completes without error, else false
		 * @private
		 */
		trigger_event : function( evt ) {
			var mod;

			if ( this.util.is_object( evt ) && evt.type ) {

				for ( mod in module_data ) {

					if ( module_data.hasOwnProperty( mod ) ) {

						mod = module_data[ mod ];
						if ( mod.evts && mod.evts[ evt.type ] ) {

							mod.evts[ evt.type ]( evt.data );
						}
					}
				}

				return true;
			} else {

				root.util.log( 1, 'Event : "' + this.util.to_string( evt.type ) + '"" : Trigger Event : FAILED : "Event object is of wrong type or there is no event type specified"' );
				return false;
			}
		},

		/**
		 * removes events from a specified module
		 *
		 * 	var evts = [ 'some-event', 'some-other-event' ];
		 *
		 * 	MOD.core.remove_events( evts, 'my-module' );
		 *
		 *
		 * @param  {object} evts     the events to remove from the modules
		 * @param  {string} moduleID the ID of the module to remove the events from
		 * @return {Boolean} true if events successfully removed, else false
		 * @method  remove_events
		 * @private
		 */
		remove_events : function( evts, moduleID ) {
			if ( root.util.is_array( evts ) &&  moduleID ) {

				// check for the existance of the specified module
				var mod = module_data[ moduleID ];

				if ( mod ) {

					// loop over the events and if they exist on the module, delete them
					var i = 0, len = evts.length;

					while ( evts[ i ] ) {

						if ( mod.evts[ evts[ i ] ] ) {

							delete mod.evts[ evts[ i ] ];
						}
						++i;
					}

					return true;
				} else {

					root.util.log( 1, 'Module : "' + moduleID + '"" : Remove Events : FAILED : "No module by that ID"' );
					return false;
				}
			} else {

				root.util.log( 1, 'Module : "' + moduleID + '"" : Remove Events : FAILED : "One or more arguments are of wrong type"' );
				return false;
			}
		}
	};

}());


;/**
 * ## The Application Engine
 * - This layer is responsible for handling starting all the modules according to the application configuration set in config.js
 * - The return object of this class has only one method, the run method which you call to start the app
 *
 *
 * **For app return object documentation see the MOD.app.return class API**
 *
 * @class  app
 * @namespace MOD
 * @static
 */

MOD.app = (function() {
	var start_on_ready, start_on_load;

	/**
	 * Responsible for starting all modules in the config assigned to start on document ready state
	 * @param  {array} modules the list of modules to start
	 * @return {none}
	 * @method  start_on_ready
	 * @private
	 */
	start_on_ready = function ( modules ) {
		var len = modules.length, i = 0;

		for ( ; i < len; ) {
			MOD.core.start( modules[ i ] );
			++i;
		}
	};

	/**
	 * Responsible for starting all modules in the config assigned to start on window load state
	 * @param  {array} modules the list of modules to start
	 * @return {none}
	 * @method  start_on_load
	 * @private
	 */
	start_on_load = function ( modules ) {
		var len = modules.length, i = 0;

		for ( ; i < len; ) {
			MOD.core.start( modules[ i ] );
			++i;
		}
	};

	/**
	 * This is the return object of the app object, it contains only the run method used to start the application
	 *
	 * @class  return
	 * @namespace MOD.app
	 */
	return {

		/**
		 * The method responsible for starting the application, reads the MOD.config object and processes the response
		 *
		 * 	MOD.app.run();
		 *
		 *
		 * @return {none}
		 * @method  run
		 * @public
		 */
		run : function () {

			// set out debug status
			MOD.core.util.debug = ( MOD.config.debug ) ? MOD.config.debug : true;

			if ( MOD.config.onready ) {
				MOD.core.dom.onready(function () {
					start_on_ready( MOD.config.onready.modules );
				});
			}

			if ( MOD.config.onload ) {
				MOD.core.dom.onload(function () {
					start_on_load( MOD.config.onload.modules );
				});
			}
		}
	};


}());
;/**
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
;/**
 * The form object is responsible for processing actions like validation and serializing data for ajax requests
 *
 * ### Usage:
 *
 * 	var form = sb.query( '#example-form' )[ 0 ],
 * 		url = form.action,
 * 		method = form.method;
 *
 * 	form = new MOD.form( form );
 *
 * 	if ( form.validate() ) {
 * 		sb.request({
 * 			url : url,
 * 			type : method,
 * 			dataType : 'JSON',
 * 			data : form.prep(),
 * 			done : function ( data ) {
 * 				// do something with return data
 * 			},
 * 			fail : function ( error ) {
 * 				// do something with error
 * 			},
 * 			scope : this
 * 		});
 * 	}
 *
 *
 * @class  form
 * @namespace MOD
 */

MOD.form = function ( form ) {
	var fields, current, error, error_container, ret, _all_fields, data;

	/**
	 * The form return object that contains all functionality like the validate method and serialize method
	 * @type {Object}
	 * @class  return
	 * @namespace MOD.form
	 */
	ret = {

		/**
		 * gets the fields to validate
		 * @param  {object} form the form DOM element to work with
		 * @return {none}
		 * @method  init
		 * @private
		 */
		init: function ( form ) {
			_all_fields = form.elements;
			fields = form.getElementsByClassName( 'validate' );
		},

		/**
		 * the function responsible for handling all validation
		 *
		 * 	var el = document.getElementById( 'example-form' );
		 *
		 * 	var form = MOD.form( el );
		 *
		 * 	if ( form.validate() ) {
		 * 		// submit form
		 * 	}
		 *
		 *
		 * @return {boolean} false if validation fails, else true
		 * @method  validate
		 * @public
		 */
		validate: function () {
			error = false;
			ret.clear_errors();

			MOD.core.util.map( fields, function( field, index ) {
				var matchField, maxlength, minlength, reg, tag, type;
				current = field;

				if ( MOD.core.dom.has_class( field, 'required' ) ) {

					ret.check.required( field );
				}

				if ( MOD.core.dom.has_class( field, 'email' ) ) {

					ret.check.email( field );
				}

				if ( MOD.core.dom.has_class( field, 'phone' ) ) {

					ret.check.phone( field );
				}

				if ( MOD.core.dom.has_class( field, 'url' ) ) {

					ret.check.url( field );
				}

				if ( MOD.core.dom.has_class( field, 'creditcard' ) ) {

					ret.check.credit_card( field );
				}

				if ( MOD.core.dom.has_class( field, 'minlength' ) ) {

					ret.check.min_length( field );
				}

				if ( MOD.core.dom.has_class( field, 'maxlength' ) ) {

					ret.check.max_length( field );
				}

				if ( MOD.core.dom.has_class( field, 'equalto' ) ) {

					ret.check.equal_to( field );
				}
			});

			if ( error !== true ) {
				return true;
			} else {
				return false;
			}
		},

		/**
		 * sets up the error by adding error class to current field and by adding error message to errors container
		 * @param {string} error the message to display with the error
		 * @return {none}
		 * @method set_error
		 * @private
		 */
		set_error: function ( error ) {
			error_container = form.getElementsByClassName( 'errors' )[ 0 ];

			if ( !error_container ) {
				var ec = {
					el : 'div',
					attrs : {
						'class' : 'errors'
					}
				};
				error_container = MOD.core.dom.create( ec );
				form.insertBefore(  error_container, form.firstChild );
			}

			MOD.core.dom.add_class( current, 'error' );

			var config = {
				el : 'p',
				text : error,
				attrs : {
					'class' : 'error-list-item'
				}
			};

			error_container.appendChild( MOD.core.dom.create( config ) );

		},

		/**
		 * responsible for clearing any previous error messages and removing error classes from elements
		 * @return {none}
		 * @method  clear_errors
		 * @private
		 */
		clear_errors: function () {
			MOD.core.util.map( fields, function ( item, index ) {
				MOD.core.dom.remove_class( item, 'error' );
			});

			if ( error_container ) {

				error_container.innerHTML = null;
			}
		},

		/**
		 * Builds an object of all fields/groups with associated values, handles all field types except file
		 * @param {Boolean} serialize if true it formats values according to application/x-www-form-urlencoded format, else it returns JSON object
		 * @return {JSON object / form urlencoded string} the form name/value pairs in one of the two specified return types
		 * @method  prep
		 * @public
		 */
		prep : function( serialize ) {
			serialize = ( serialize ) ? serialize : false;
			data = {};
			var pairs = [], name;

			MOD.core.util.map( _all_fields, function( field, index ) {
				var tag = field.tagName.toLowerCase();

				switch ( tag ) {
					case 'input':
						var type = field.type;

						switch ( type ) {
							case 'text':
							case 'email':
							case 'password':
							case 'phone':
							case 'url':
								data[ field.name ] = field.value;
							break;
							case 'checkbox':
								if ( field.checked ) {
									data[ field.name ] = '1';
								} else {
									data[ field.name ] = '0';
								}
							break;
							case 'radio':
								var checked = false;
								MOD.core.util.map( form[ field.name ], function( radio, index ) {
									if ( radio.checked ) {

										data[ field.name ] = radio.value;
										checked = true;
									}
								});
								if ( !checked ) {
									data[ field.name ] = '0';
								}
							break;
						}
					break;
					case 'textarea':
						data[ field.name ] = field.value;
					break;
					case 'select':
						if ( !field.multiple ) {

							if ( field.selectedIndex !== -1 ) {

								data[ field.name ] = field.options[ field.selectedIndex ].value;
							} else {
								data[ field.name ] = '';
							}
						} else {
							if ( field.selectedIndex !== -1 ) {
								var arr = [];

								MOD.core.util.map( field.options, function( option, index ) {
									if ( option.selected === true ) {

										arr.push( option.value );
									}
								});

								data[ field.name ] = arr;
							} else {
								data[ field.name ] = [];
							}
						}
					break;
				}
			});

			if ( !data ) return "";

			if ( serialize ) {

				for ( name in data ) {
					if ( data.hasOwnProperty( name ) ) {

						if ( typeof data !== 'function' ) {

							var value = data[ name ].toString();
							name = encodeURIComponent( name ).replace( /\%20/g, '+' );
							value = encodeURIComponent( value ).replace( /\%20/g, '+' );

							pairs.push( name + '=' + value );
						}
					}
				}

				return pairs.join( '&' );
			} else {
				return JSON.stringify( data );
			}
		},     // end prep function

		/**
		 * contains all the check methods for validation
		 * @type {Object}
		 * @class check
		 * @namespace MOD.form.return
		 */
		check : {

			/**
			 * Checks to make the field has a value
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method required
			 * @private
			 */
			required : function ( field ) {
				var tag = field.tagName.toLowerCase();

				switch ( tag ) {
					case 'input':
						var type = field.type;

						switch ( type ) {
							case 'text':
							case 'email':
							case 'password':
							case 'phone':
							case 'url':
								if ( field.value.length < 1 ) {

									error = true;
									ret.set_error( 'One or more fields are required.' );
								}
							break;
							case 'checkbox': {
								if ( field.checked === false ) {

									error = true;
									ret.set_error( 'This field is required.' );
								}
							}
							break;
							case 'radio': {
								var name = field.name, selected = false;
								var radios = [], radio, i, len;

								MOD.core.util.map( fields, function ( item, index ) {
									if ( item.name === name ) {
										radios.push( item );
									}
								});

								for ( i = 0, len = radios.length; i < len; i++ ) {

									if ( radios[ i ].checked === true ) {

										selected = true;
										return;
									}
								}
								if ( !selected ) {

									error = true;
									ret.set_error( 'One or more options is required.' );
								}
							}
							break;
						}
					break;
					case 'textarea':
						if ( field.value.length < 1 ) {

							error = true;
							ret.set_error( 'One or more fields are required.' );
						}
					break;
					case 'select':
						if ( field.options.selectedIndex === -1 ) {

							error = true;
							ret.set_error( 'One or more options are required.' );
						}
					break;
				}
			},

			/**
			 * Checks to make sure the field is a valid email address
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method email
			 * @private
			 */
			email : function ( field ) {
				var val = field.value;
					arr = val.match( /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ );

				if ( arr === null ) {

					error = true;
					ret.set_error( 'Not a valid email address.' );
				}
			},

			/**
			 * Checks to make sure field value is a valid phone number
			 *
			 * - 5558675309
			 * - 555 867 5309
			 * - 555-867-5309
			 * - 555.867.5309
			 * - (555) 867 5309
			 * - (555)-867-5309
			 * - (555).867.5309
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method  phone
			 * @private
			 */
			phone : function ( field ) {
				var val = field.value,
					arr = val.match( /^\(+?[0-9]{3}\)+?\s[0-9]{3}[\s|\.|-][0-9]{4}|^[0-9]{3}[\s|\.|\-][0-9]{3}[\s|\.|-][0-9]{4}|^[0-9]{10}$/ );
				if ( arr === null ) {

					error = true;
					ret.set_error( 'Not a valid phone number.' );
				}
			},

			/**
			 * Checks to make sure the field is a valid url
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method  url
			 * @private
			 */
			url : function ( field ) {
				var val = field.value,
					arr = val.match( /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/ );

				if ( arr === null ) {

					error = true;
					ret.set_error( 'Not a valid url.' );
				}
			},

			/**
			 * Checks to make sure the field is a number 16 digits in length
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method  credit_card
			 * @private
			 */
			credit_card : function ( field ) {
				var val = field.value,
					arr = val.match( /\d{16}/ );

				if ( arr === null ) {

					error = true;
					ret.set_error( 'Not a valid credit card number.' );
				}
			},

			/**
			 * Checks to see if value length is greater than minimum
			 *
			 * - input
			 * - select ( multi )
			 * - textarea
			 *
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method  min_length
			 * @private
			 */
			min_length : function ( field ) {
				var tag = field.tagName.toLowerCase(),
					minlength = parseInt( field.getAttribute( 'data-minlength' ), 10 );

				switch ( tag ) {
					case 'input':
						type = field.type;

						switch ( type ) {
							case 'text':
							case 'email':
							case 'password':
							case 'phone':
							case 'url':
								if ( field.value.length < minlength ) {

									error = true;
									ret.set_error( 'Minimum length is ' + minlength + '.' );
								}
							break;
						}
					break;
					case 'textarea':
						if ( field.value.length < minlength ) {

							error = true;
							ret.set_error( 'Minimum length is ' + minlength + '.' );
						}
					break;
					case 'select':
						var count = 0, option;

						if ( field.multiple ) {
							for ( i = 0, len = field.options.length; i < len; i++ ) {
								if ( field.options[ i ].selected === true ) {

									++count;
								}
							}

							if ( count < minlength ) {
								error = true;
								ret.set_error( 'Minimum length is ' + minlength + '.' );
							}
						}
					break;
				}
			},

			/**
			 * Checks to see if value length is less than maximum
			 *
			 * - input
			 * - select ( multi )
			 * - textarea
			 *
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method max_length
			 * @private
			 */
			max_length : function ( field ) {
				var tag = field.tagName.toLowerCase(),
					maxlength = parseInt( field.getAttribute( 'data-maxlength' ), 10 );

				switch ( tag ) {
					case 'input':
						var type = field.type;

						switch ( type ) {
							case 'text':
							case 'email':
							case 'password':
							case 'phone':
							case 'url':
								if ( field.value.length > maxlength ) {

									error = true;
									ret.set_error( 'Maximum length is ' + maxlength + '.' );
								}
							break;
						}
					break;
					case 'textarea':
						if ( field.value.length > maxlength ) {

							error = true;
							ret.set_error( 'Maximum length is ' + maxlength + '.' );
						}
					break;
					case 'select':
						var count = 0, option, i, len;

						if ( field.multiple ) {
							for ( i = 0, len = field.options.length; i < len; i++ ) {
								if ( field.options[ i ].selected === true ) {

									++count;
								}
							}

							if ( count > maxlength ) {
								error = true;
								ret.set_error( 'Maximum length is ' + maxlength + '.' );
							}
						}
					break;
				}
			},

			/**
			 * Checks to see if value length is equal to the specified length
			 *
			 * - input
			 * - select ( multi )
			 * - textarea
			 *
			 *
			 * @param  {object} field the field to check the value of
			 * @return {none}
			 * @method equal_to
			 * @private
			 */
			equal_to : function ( field ) {
				var tag = field.tagName.toLowerCase(),
					equalto = parseInt( field.getAttribute( 'data-equalto' ), 10 );

				switch ( tag ) {
					case 'input':
						var type = field.type;

						switch ( type ) {
							case 'text':
							case 'email':
							case 'password':
							case 'phone':
							case 'url':
								if ( field.value.length !== equalto ) {

									error = true;
									ret.set_error( 'Minimum length is ' + equalto + '.' );
								}
							break;
						}
					break;
					case 'textarea':
						if ( field.value.length !== equalto ) {

							error = true;
							ret.set_error( 'Minimum length is ' + equalto + '.' );
						}
					break;
					case 'select':
						var count = 0, option, i, len;

						if ( field.multiple ) {
							for ( i = 0, len = field.options.length; i < len; i++ ) {
								if ( field.options[ i ].selected === true ) {

									++count;
								}
							}

							if ( count !== equalto ) {
								error = true;
								ret.set_error( 'Minimum length is ' + equalto + '.' );
							}
						}
					break;
				}
			}
		}     // end check object
	};     // end return object

	ret.init( form );
	return ret;
};



;/**
 * The ui object stores all of the prebuilt widgets for the framework
 *  - scroll : scrolls to section on page
 *
 * @class  ui
 * @namespace MOD
 */

MOD.ui = {
	/**
	 * Scroll to section widget that allows for scolling to a section of the page with custom callback function
	 *
	 * 	var scroller = new PIX.ui.scroll({
	 * 		el : 'scroll-anchor', // the id of the element to set event on
	 * 		offset : 0, // the amount of distance to offset the scroll
	 * 		duration : 300, // the amount of time it takes to complete scroll
	 * 		callback : function () {} // the function to fire when element is done scrolling
	 * 	});
	 *
	 * 	scroller.update( newConfig ); // you can use the update function to set new params
	 *
	 *
	 * @return {object} the update method, allows you to update any config property
	 * @method  scroll
	 * @public
	 */
	scroll : function ( config ) {
		var el, target, offset, duration, callback, sb, ret;

		function init ( config ) {
			el = document.getElementById( config.el );
			offset = config.offset;
			duration = config.duration;
			callback = config.callback;

			target = document.getElementById( el.href.split( '#' )[1] );
			sb = PIX.sandbox.create( PIX.core, config.el );
			sb.add_event( el, 'click', scroll );
		}

		function destroy () {
			sb.remove_event( el, 'click', scroll );
			el = target = offset = duration = callback = null;
		}

		function scroll ( e ) {
			var top = sb.offset( target ).y;
			var attrs = {
				'scroll-top' : top - offset
			};

			sb.animate( 'html, body', attrs, duration, callback );

			sb.notify({
				type : 'ui.scroll.' + config.el,
				data : null
			});

			e.preventDefault();
		}

		ret = {
			update : function ( config ) {
				destroy();
				init( config );
			}
		};

		init( config );
		return ret;
	}
};