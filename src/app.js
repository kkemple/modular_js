/**
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
			MOD.core.start( modules[ i ] );
			++i;
		}
	}

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
	}


}());
