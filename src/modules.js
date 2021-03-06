
/**
 * All modules for the application are stored in this file
 * A module is a small piece of the application that is responsible for a minute
 * amount of tasks
 */


/**
 * instagram-search-settings
 * responsible for sending notifications when a search is requested
 *
 * @param  {object} sb a copy of the sandbox to interact with the core
 * @return {none}
 */
MOD.core.create_module( 'instagram-search', function( sb ) {
	var btn, input, loader, cache = {}, interval;

	return {
		init : function () {
			btn = sb.find( '.instagram-search-submit' )[ 0 ],
			input = sb.find( '.instagram-search-term' )[ 0 ],
			loader = sb.find( '.ajax-loader' )[ 0 ];

			sb.add_event( btn, 'click', this.search );

			// clear cache every 10 min
			interval = setInterval(function () {
				cache = {};
			}, 60*10*1000 );
		},

		destroy : function () {
			sb.remove_event( btn, 'click', this.search );
			btn = input = loader = null, cache = {};
			clearInterval( interval );
		},

		search : function ( e ) {

			//get our vars, set a default for the search term
			var term = input.value || 'javascript',
				instagramURL;
				access_token = '22033045.ea9028a.eec94286a2e049429fe51c3fbc95db20';

			// set the loader to active
			sb.add_class( loader, 'active' );

			// check the cache for the search term
			if ( cache && cache[ term ] ) {

				// let the core know we have a notification to broadcast
				sb.notify({
					type : 'instagram-search-results-returned',
					data : cache[ term ]
				});

				// update the loader
				sb.remove_class( loader, 'active' );
			} else {

				// build our request URL
				instagramURL = 'https://api.instagram.com/v1/tags/' + term + '/media/recent?callback=?&count=10&access_token=' + access_token;

				sb.request({
					url : instagramURL,
					type : 'GET',
					dataType : 'JSON',
					done : function ( response ) {

						// cache the request for ten minutes
						cache[ term ] = response.data;

						// let the core know we have a notification to announce
						sb.notify({
							type : 'instagram-search-results-returned',
							data : response.data
						});

						// update the loader
						sb.remove_class( loader, 'active' );
					},
					fail : function ( error ) {

						// TODO: add a better system for this, I will prolly run function again
						alert( error.message );
						sb.remove_class( loader, 'active' );
					},
					scope : this
				});
			}
		}
	}
});


/**
 * instagram feed
 * responsible for building the feed when a search is requested
 *
 * @param  {object} sb a copy of the sandbox to interact with the core
 * @return {none}
 */
MOD.core.create_module( 'instagram-feed', function( sb ) {
	var container, loader, root = this;

	return {
		init : function () {
			container = sb.find( '.instagram-post-container' )[ 0 ],
			loader = sb.find( '.ajax-loader' )[ 0 ];

			sb.listen({
				'instagram-search-results-returned' : this.build
			});
		},

		destroy : function () {
			sb.ignore( [ 'instagram-search-results-returned' ], 'instagram-feed' );
			container = loader = null;
		},

		build : function ( data ) {
			var i = 0, html = '';

			// remove any previous results or messages
			container.innerHTML = null;

			// sanity check for data
			if ( data ) {

				sb.add_class( loader, 'active' );

				// store out templating function
				var build_post = MOD.template.parse( 'instagram_post_template' );

				// generate the HTML
				sb.foreach( data, function( item, index ) {
					html += build_post( item );
				});

			} else {

				// if data is empty then there are no results, so let the user know
				html = sb.create_element({
					el : 'p',
					text : 'Sorry, no results for that search term... =[',
					attrs : {
						'class' : 'instagram-feed-no-results'
					}
				});
			}

			// Finish loading
			sb.remove_class( loader, 'active' );

			// add the instagram posts or message
			sb.append( container, html );
		}
	}
});