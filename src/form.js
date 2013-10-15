/**
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



