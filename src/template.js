
/**
 * template namespace handles the conversion of micro templates
 * > **To see this in action simply look at the code for the example**
 *
 * #### Usage:
 * Templating can save you a ton of time and the browser a ton of memory if done correctly. It is perfect for handling JSON responses from AJAX calls and it is very lightweight. Below you will find and example of how to use it.
 *
 *
 *
 * 	 // First add a script tag with a type of "text/template" to your page
 * 	 // This won't be read by the browser or by GOOGLE or screen readers
 * 	<script type="text/template">
 *
 * 	</script>
 *
 * 	// Then build out your HTML as if you were just hard-coding it
 * 	<li class="instagram-post">
 *              <div class="instagram-image-container">
 *                  <img src="" class="instagram-image" />
 *              </div>
 *              <div class="instagram-meta-data">
 *                  <div class="instagram-meta-top">
 *                      <div class="instagram-user">
 *                          <img src="" class="instagram-user-profile-img" />
 *                          <span class="instagram-username"></span>
 *                      </div>
 *                      <div class="instagram-tags">
 *                          <p></p>
 *                      </div>
 *                      <div class="instagram-likes">
 *                          <p></p>
 *                      </div>
 *                  </div>
 *              </div>
 *         </li>
 *
 *	// next we add in our template tags "<% %>" and let the engine know where exactly we will access our passed in object
 *	// pay close attention to the "=" sign in the template tags, this lets the parser know you want a value, otherwise
 *	// it expects to run an operation
 *	// if you look at the tags section you will see we return the value of an operation and this is perfectly acceptable
 *
 * 	<li class="instagram-post">
 *              <div class="instagram-image-container">
 *                  <img src="<%= images.standard_resolution.url %>" class="instagram-image" />
 *              </div>
 *              <div class="instagram-meta-data">
 *                  <div class="instagram-meta-top">
 *                      <div class="instagram-user">
 *                          <img src="<%= user.profile_picture %>" class="instagram-user-profile-img" />
 *                          <span class="instagram-username"><%= user.username %></span>
 *                      </div>
 *                      <div class="instagram-tags">
 *                          <p><%= tags.join( ', ' ) %></p>
 *                      </div>
 *                      <div class="instagram-likes">
 *                          <p><%= likes.count %></p>
 *                      </div>
 *                  </div>
 *              </div>
 *         </li>
 *
 * 	// you can also run for loops like so
 * 	<ul>
 * 	<% for ( var i = 0, len = user.images.length; i < len; i++ ) { %>
 *  		<li><img src="<%= user.images[ i ] %>" /></li>
 * 	<% } %>
 * 	</ul>
 *
 * 	// Putting it all together
 * 	<script type="text/template" id="instagram_post_template">
 *  		<li class="instagram-post">
 *        		     <div class="instagram-image-container">
 *        		         <img src="<%= images.standard_resolution.url %>" class="instagram-image" />
 *        		     </div>
 *        		     <div class="instagram-meta-data">
 *        		         <div class="instagram-meta-top">
 *        		             <div class="instagram-user">
 *        		                 <img src="<%= user.profile_picture %>" class="instagram-user-profile-img" />
 *        		                 <span class="instagram-username"><%= user.username %></span>
 *        		             </div>
 *        		             <div class="instagram-tags">
 *        		                 <p><%= tags.join( ', ' ) %></p>
 *        		             </div>
 *        		             <div class="instagram-likes">
 *        		                 <p><%= likes.count %></p>
 *        		             </div>
 *        		         </div>
 *        		     </div>
 *        		</li>
 * 	</script>
 *
 *	// data will be our return object from an ajax request to instagram
 *
 * 	var html = '', build_post;
 *
 * 	build_post = MOD.template.parse( 'instagram_post_template' );
 *
 * 	sb.foreach( data, function( item, index ) {
 * 		html += build_post( item );
 * 	});
 *
 * 	sb.append( some_element, html );
 *
 *
 *
 * @return {object} the object containing the parse method
 * @class  template
 * @namespace MOD
 */
MOD.template = (function() {
	var cache = {};

	/**
	 * The return object containing our parse method
	 * @type {Object}
	 */
	ret = {
		/**
		 * The method responsible for creating the function to run on our template
		 * @param  {string} id   the id of the template tag to fetch
		 * @param  {anything} data the information you want to inject into the template
		 * @return {function/HTML string}      if data is passed the function is called immediately else it is returned so it can be used later in the code
		 * @method  parse
		 * @public
		 */
		parse : function ( id, data ) {

			if ( cache[ id ] ) {
				return data ? cache[ id ]( data ) : cache[ id ];
			} else {

				var template = document.getElementById( id ).innerHTML;
				var fn = new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with() {}
					"with(obj){p.push('" +

					// Convert the template into pure JavaScript
					template
						.replace(/[\r\t\n]/g, " ")
						.split("<%").join("\t")
						.replace(/((^|%>)[^\t]*)'/g, "$1\r")
						.replace(/\t=(.*?)%>/g, "',$1,'")
						.split("\t").join("');")
						.split("%>").join("p.push('")
						.split("\r").join("\\'")
					+ "');}return p.join('');");

				cache[ id ] = fn;

				return data ? fn( data ) : fn;
			}
		}
	};

	return ret;
}());