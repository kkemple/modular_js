/**
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