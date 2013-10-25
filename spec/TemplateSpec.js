describe( 'MOD.template', function () {
	describe( 'MOD.template.parse', function () {
		it( 'should parse a template and replace any specified values, also run any javascript', function () {
			var colors = [ 'red', 'blue', 'green', 'yellow', 'orange' ],
				html = MOD.template.parse( 'jasmine_template', { colors: colors } ),
				arr = [];

			arr = html.match( /<li>/g );

			expect( html.indexOf( 'ul' ) ).toNotEqual( -1 );
			expect( arr.length ).toEqual( 5 );
		});
	});
});