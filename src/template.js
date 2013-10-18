MOD.template = (function() {
	var cache = {};

	ret = {
		parse : function ( id, data ) {
			var template = document.getElementById( id ).innerHTML;

			if ( cache[ id ] ) {
				return data ? cache[ id ]( data ) : cache[ id ];
			} else {

				var fn = new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with(){}
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