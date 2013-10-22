
// TODO: vanillify ajax requests
// TODO: vanillify event handlers
// TODO: vanillify animations
// TODO: vanillify queries
// TODO: add standard animations like fade and slide


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
 *
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
		 *
		 * 	var str = 'some-string';
		 *
		 * 	str = PIX.core.util.to_camel_case( str );
		 *
		 * 	console.log( str ); // would output 'someString'
		 *
		 *
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
		 * 	MOD.core.util.is_object( obj );
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
		 * 	MOD.core.util.is_array( arr );
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
		 *
		 * 	if ( PIX.core.util.array_contains( arr, 'some value' ) ) {
		 * 		// do something with value
		 * 	}
		 *
		 *
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
			var i, len, el, child;


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

						i = 0,
						len = config.children.length;

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

			delete config;

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
					}
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
		 * @param  {object / string} css the key/value object of css properties / or css property string
		 * @param  {string} if set, should be string value of style to set on element
		 * @return {string / null} if calling for property returns property value as string
		 * @method  style
		 * @private
		 */
		style : function ( el, css, value ) {
			var ccProp, prop;

			if ( typeof css === 'object' ) {

				for ( prop in css ) {

					if ( css.hasOwnProperty( prop ) ) {

						ccProp = root.util.to_camel_case( prop );

						el.style[ ccProp ] = css[ prop ];
					}
				}

				return null;
			} else if ( typeof css === 'string' && value === undefined ) {

				compStyle = ( window.getComputedStyle ) ? window.getComputedStyle( el ) : getComputedStyle( el );
				return compStyle.getPropertyValue( css );
			} else if ( typeof css === 'string' && typeof value === 'string' ) {

				el.style[ root.util.to_camel_case( css ) ] = value;
				return null;
			} else {
				root.util.log( 1, 'STYLE : FAILED : "One or more arguments are of wrong type"' );
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
		 * Gets the next element that is not a text node, script tag, or style tag
		 *
		 * 	var next = MOD.core.dom.next_element( el );
		 *
		 *
		 * @param  {object} el the object whos next sibling you require
		 * @return {object}    the next sibling
		 * @method  next_element
		 * @private
		 */
		next_element : function ( el ) {
			var next;

			next = el.nextSibling;

			if ( next === null ) {

				return null;
			} if ( next.nodeType > 1 ) {

				return this.next_element( next );
			} else if ( next.tagName.toLowerCase() === 'script' ) {

				return this.next_element( next );
			} else if ( next.tagName.toLowerCase() === 'style' ) {

				return this.next_element( next );
			} else {

				return next;
			}
		},

		/**
		 * Gets the previous element that is not a text node, script tag, or style tag
		 *
		 * 	var prev = MOD.core.dom.previous_element( el );
		 *
		 *
		 * @param  {object} el the object whos previous sibling you require
		 * @return {object}    the previous sibling
		 * @method  previous_element
		 * @private
		 */
		previous_element : function ( el ) {
			var prev;

			prev = el.previousSibling;

			if ( prev === null ) {

				return null;
			} else if ( prev.nodeType > 1 ) {

				return this.previous_element( prev );
			} else if ( prev.tagName.toLowerCase() === 'script' ) {

				return this.previous_element( prev );
			} else if ( prev.tagName.toLowerCase() === 'style' ) {

				return this.previous_element( prev );
			} else {

				return prev;
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
		 * 			term = input.value;
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
		create_module : function ( moduleID, creator ) {
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
		start : function ( moduleID ) {
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
		start_all : function () {
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
		stop : function ( moduleID ) {
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
		stop_all : function () {
			var moduleID;

			for ( var moduleID in module_data ) {

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
		register_events : function ( evts, moduleID ) {
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
		trigger_event : function ( evt ) {
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
		remove_events : function ( evts, moduleID ) {
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



	/*======================================
		Assistive Functions
	======================================*/

	// Author Shawn Allen
	// https://github.com/shawnbot/aight/blob/master/js/computed-style.js

	function getComputedStyle ( el ) {

		var Push = Array.prototype.push;

		function getComputedStylePixel( element, property, fontSize ) {
			var
			value = element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
			size = value[ 1 ],
			suffix = value[ 2 ],
			rootSize;

			fontSize = fontSize != null ? fontSize : /%|em/.test( suffix ) && element.parentElement ? getComputedStylePixel( element.parentElement, 'fontSize', null ) : 16;
			rootSize = property == 'fontSize' ? fontSize : /width/i.test( property ) ? element.clientWidth : element.clientHeight;

			return suffix === '%' ? size / 100 * rootSize :
			       suffix === 'cm' ? size * 0.3937 * 96 :
			       suffix === 'em' ? size * fontSize :
			       suffix === 'in' ? size * 96 :
			       suffix === 'mm' ? size * 0.3937 * 96 / 10 :
			       suffix === 'pc' ? size * 12 * 96 / 72 :
			       suffix === 'pt' ? size * 96 / 72 :
			       size;
		}

		function setShortStyleProperty( style, property ) {
			var
			borderSuffix = property == 'border' ? 'Width' : '',
			t = property + 'Top' + borderSuffix,
			r = property + 'Right' + borderSuffix,
			b = property + 'Bottom' + borderSuffix,
			l = property + 'Left' + borderSuffix;

			style[ property ] = ( style[ t ] == style[ r ] && style[ t ] == style[ b ] && style[ t ] == style[ l ] ? [ style[ t ] ] :
			                   style[ t ] == style[ b ] && style[ l ] == style[ r ] ? [ style[ t ], style[ r ] ] :
			                   style[ l ] == style[ r ] ? [ style[ t ], style[ r ], style[ b ] ] :
			                   [ style[ t ], style[ r ], style[ b ], style[ l ] ]).join(' ');
		}

		function CSSStyleDeclaration( element ) {
			var
			style = this,
			currentStyle = element.currentStyle,
			fontSize = getComputedStylePixel( element, 'fontSize' );

			for ( property in currentStyle ) {
				Push.call( style, property == 'styleFloat' ? 'float' : property.replace( /[A-Z]/, function ( match ) {
					return '-' + match.toLowerCase();
				}));

				if ( property === 'width' ) {

					style[ property ] = element.offsetWidth + 'px';
				} else if ( property === 'height' ) {

					style[ property ] = element.offsetHeight + 'px';
				} else if ( property === 'styleFloat' ) {
					style[ 'float' ] = currentStyle[ property ];
				} else if ( /margin.|padding.|border.+W/.test( property ) && style[ property ] != 'auto' ) {

					style[ property ] = Math.round( getComputedStylePixel( element, property, fontSize ) ) + 'px';
				} else {

					style[ property ] = currentStyle[ property ];
				}
			}

			setShortStyleProperty( style, 'margin' );
			setShortStyleProperty( style, 'padding' );
			setShortStyleProperty( style, 'border' );

			style.fontSize = Math.round( fontSize ) + 'px';
		}

		CSSStyleDeclaration.prototype = {
			constructor: CSSStyleDeclaration,

			getPropertyPriority: function () {

				throw Error( 'NotSupportedError: DOM Exception 9' );
			},

			getPropertyValue: function ( property ) {

				if ( property === undefined ) {

					throw Error('TypeError: Not enough arguments to CSSStyleDeclaration.getPropertyValue');
				}

				property = property.replace( /-\w/g, function ( match ) {
					return match[ 1 ].toUpperCase();
				});

				return ( typeof this[ property ] === 'function' ||
					property.match( /^(?:cssText|length|\d+)$/ ) ) ? '' : this[ property ];
			},

			item: function ( index ) {

				if ( property === undefined ) {
					throw Error( 'TypeError: Not enough arguments to CSSStyleDeclaration.item' );
				}

				return this[ parseInt( index, 10 ) ];
			},

			removeProperty: function () {

				throw Error( 'NoModificationAllowedError: DOM Exception 7' );
			},

			setProperty: function () {

				throw Error( 'NoModificationAllowedError: DOM Exception 7' );
			},

			getPropertyCSSValue: function () {

				throw Error( 'NotSupportedError: DOM Exception 9' );
			}
		};

		return new CSSStyleDeclaration( el );
	}
}());


