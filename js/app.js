/**
 * ## The Application Engine
 * - This layer is responsible for handling starting all the modules according to the application configuration set in {root}/pixafy/pixjs.json
 * - The return object of this class has only one method, the run method which you call to start the app
 * - **This layer depends on the PIXJS_CONFIG global application configuration object**
 *
 * **For app return object documentation see the PIX.app.return class API**
 *
 * @class  app
 * @namespace PIX
 * @static
 */

PIX.app = (function() {

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
			PIX.core.start( modules[ i ] );
			++i;
		}
	},

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
			PIX.core.start( modules[ i ] );
			++i;
		}
	}

	/**
	 * This is the return object of the app object, it contains only the run method used to start the application
	 *
	 * @class  return
	 * @namespace PIX.app
	 */
	return {

		/**
		 * The method responsible for starting the application, makes an ajax call to the pixjs.json config file and processes the response
		 *
		 * 	PIX.app.run();
		 *
		 *
		 * @return {none}
		 * @method  run
		 * @public
		 */
		run : function () {

			// set out debug status
			PIX.core.util.debug = ( PIX.config.debug ) ? PIX.config.debug : true;

			if ( PIX.config.onready ) {
				PIX.core.dom.onready(function () {
					start_on_ready( PIX.config.onready.modules );
				});
			}

			if ( PIX.config.onload ) {
				PIX.core.dom.onload(function () {
					start_on_load( PIX.config.onload.modules );
				});
			}
		}
	}


}());
