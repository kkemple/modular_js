describe("MOD.core", function () {

	describe( 'MOD.core.create_module', function () {
		it( 'should create an instance of a module', function() {
			var testCreator = function ( sb ) {

				ret = {
					init : function () {},
					destroy : function () {}
				};

				return ret;
			};

			expect( MOD.core.create_module( 'test-module' , testCreator ) ).toEqual( true );
		});
	});

	describe( 'MOD.core.start', function() {
		it( 'should successfully start an instance of a module', function() {
			var testCreator = function ( sb ) {

				ret = {
					init : function () {},
					destroy : function () {}
				};

				return ret;
			};

			MOD.core.create_module( 'test-module' , testCreator );

			expect( MOD.core.start( 'test-module' ) ).toEqual( true );
		});
	});

	describe( 'MOD.core.stop', function() {
		it( 'should successfully stop an instance of a module', function() {
			var testCreator = function ( sb ) {

				ret = {
					init : function () {},
					destroy : function () {}
				};

				return ret;
			};

			MOD.core.create_module( 'test-module' , testCreator );

			MOD.core.start( 'test-module' );

			expect( MOD.core.stop( 'test-module' ) ).toEqual( true );
		});
	});

	describe( 'MOD.core.start_all', function() {
		it( 'should successfully start all modules', function() {
			var testCreator = function ( sb ) {

				ret = {
					init : function () {},
					destroy : function () {}
				};

				return ret;
			};

			MOD.core.create_module( 'test-module' , testCreator );
			MOD.core.create_module( 'test-module2' , testCreator );

			expect( MOD.core.start_all() ).toEqual( true );
		});
	});

	describe( 'MOD.core.stop_all', function() {
		it( 'should successfully stop all modules', function() {
			var testCreator = function ( sb ) {

				ret = {
					init : function () {},
					destroy : function () {}
				};

				return ret;
			};

			MOD.core.create_module( 'test-module' , testCreator );
			MOD.core.create_module( 'test-module2' , testCreator );

			MOD.core.start( 'test-module' );
			MOD.core.start( 'test-module2' );

			expect( MOD.core.stop_all() ).toEqual( true );
		});
	});

	describe( 'MOD.core.register_events', function() {
		it( 'should successfully add event listeners to a module', function() {
			var testCreator = function ( sb ) {

				ret = {
					init : function () {},
					destroy : function () {}
				};

				return ret;
			};

			MOD.core.create_module( 'test-module' , testCreator );

			function callback( data ) {
				return true;
			}

			var evts = {
				'test-event' : callback
			};

			expect( MOD.core.register_events( evts, 'test-module' ) ).toEqual( true );
		});
	});

	describe( 'MOD.core.remove_events', function() {
		it( 'should successfully remove event listeners from a module', function() {
			var testCreator = function ( sb ) {

				ret = {
					init : function () {},
					destroy : function () {}
				};

				return ret;
			};

			MOD.core.create_module( 'test-module' , testCreator );

			function callback( data ) {
				return true;
			}

			var evts = {
				'test-event' : callback
			};

			MOD.core.register_events( evts, 'test-module' );

			expect( MOD.core.remove_events( ['test-event'], 'test-module' ) ).toEqual( true );
		});
	});

	describe( 'MOD.core.trigger_event', function() {
		it( 'should successfully trigger an event ( NOTE: no modules have to listen, it just has to fire )', function() {

			var evt = {
				type : 'test-event',
				data : { pass: true }
			};

			expect( MOD.core.trigger_event( evt ) ).toEqual( true );
		});
	});

	describe( 'MOD.core.dom', function () {
		describe( 'MOD.core.dom.query', function () {
			var ret;

			beforeEach(function () {
				var el = document.createElement( 'div' );
				el.setAttribute( 'id', 'test-element' );

				document.body.appendChild( el );

				ret = MOD.core.dom.query( '#test-element' );
			});

			it( 'should return queried DOM elements in an array like object', function () {
				expect( ret[ 0 ] ).toBeDefined();
			});

			it( 'should return an object with a length property', function () {
				expect( ret.length ).toBeDefined();
			});

			it( 'should return an object with a query method for finding elements within itself', function () {
				expect( ret.query ).toBeDefined();
			});
		});

		describe( 'MOD.core.dom.bind', function () {
			//TODO: add tests
		});

		describe( 'MOD.core.dom.unbind', function () {
			//TODO: add tests
		});

		describe( 'MOD.core.dom.create', function () {
			it( 'should except a config option and build the specified element', function () {
				var config = {
					el : 'p'
				};

				var el = MOD.core.dom.create( config );

				expect( el ).toBeDefined();
			});

			it( 'should support adding text to the element', function () {
				var config = {
					el : 'p',
					text : 'test it'
				};

				var el = MOD.core.dom.create( config );

				expect( el.innerHTML ).toEqual( 'test it' );
			});

			it( 'should support adding attributes to the element', function () {
				var config = {
					el : 'p',
					text : 'hey there',
					attrs : {
						'id' : 'test-element-id'
					}
				};

				var el = MOD.core.dom.create( config );

				expect( el.id ).toEqual( 'test-element-id' );
			});

			it( 'should support adding child elements to the element', function () {
				var config = {
					el : 'div',
					children : [
						{
							el : 'p',
							text : 'test it',
							attrs : {
								id : 'test-child-node'
							}
						}
					]
				};

				var el = MOD.core.dom.create( config );

				expect( el.children.length ).toBeGreaterThan( 0 );
			});
		});

		describe( 'MOD.core.dom.apply_attrs', function() {
			it( 'should add attributes to the specified element', function() {
				var el = document.createElement( 'div' );

				var attrs = {
					'id' : 'test-apply-attrs',
					'class' : 'test-apply-attrs-class',
					'data-test' : 'pass'
				};

				MOD.core.dom.apply_attrs( el, attrs );

				expect( el.id ).toEqual( 'test-apply-attrs' );
				expect( el.getAttribute( 'data-test' ) ).toEqual( 'pass' );
				expect( el.className ).toEqual( 'test-apply-attrs-class' );
			});
		});

		describe( 'MOD.core.dom.prop', function () {
			it( 'should allow you to set individual properties of an element', function () {
				var el = document.createElement( 'div' );

				MOD.core.dom.prop( el, 'id', 'pass' );
				expect( el.id ).toEqual( 'pass' );
			});

			it( 'should allow you to get individual properties of an element', function () {
				var el = document.createElement( 'div' );

				MOD.core.dom.prop( el, 'id', 'pass' );
				expect( MOD.core.dom.prop( el, 'id' ) ).toEqual( 'pass' );
			});
		});

		describe( 'MOD.core.dom.style', function () {
			it( 'should allow you to update the style of an element', function () {
				var el = document.createElement( 'div' );

				var css = {
					'color' : 'green',
					'border-width': '1px',
					'border-color': 'green'
				};

				MOD.core.dom.style( el, css );

				expect( el.style.color ).toEqual( 'green' );
				expect( el.style.borderWidth ).toEqual( '1px' );
				expect( el.style.borderColor ).toEqual( 'green' );
			});
		});

		describe( 'MOD.core.dom.add_class', function() {
			it( 'should add a class to an element using a string format', function () {
				var el = document.createElement( 'div' );

				MOD.core.dom.add_class( el, 'test1' );
				expect( el.className ).toEqual( 'test1' );
			});

			it( 'should add a set of classes to an element using a string format', function () {
				var el = document.createElement( 'div' );

				MOD.core.dom.add_class( el, 'test1 test2 test3' );
				var arr = el.className.split( /\s+/ );

				expect( arr[ 0 ] ).toEqual( 'test1' );
				expect( arr[ 1 ] ).toEqual( 'test2' );
				expect( arr[ 2 ] ).toEqual( 'test3' );
			});
		});

		describe( 'MOD.core.dom.remove_class', function() {
			it( 'should remove a class to an element using a string format', function () {
				var el = document.createElement( 'div' );

				el.className = 'test1';
				MOD.core.dom.remove_class( el, 'test1' );

				expect( el.className ).toEqual( '' );
			});

			it( 'should remove a set of classes to an element using a string format', function () {
				var el = document.createElement( 'div' );

				el.className = 'test1 test2 test3 pass';
				MOD.core.dom.remove_class( el, 'test1 test2 test3' );

				expect( el.className ).toEqual( 'pass' );
			});
		});

		describe( 'MOD.core.dom.has_class', function () {
			it( 'should return true if element has specified class name', function () {
				var el = document.createElement( 'div' );

				el.className = 'test1';

				expect( MOD.core.dom.has_class( el, 'test1' ) ).toEqual( true );
			});
		});

		describe( 'MOD.core.dom.append_elems', function () {
			it( 'should add child elements to the end of children of an element', function () {
				var config = {
					el : 'div',
					attrs : {
						'id' : 'test-parent'
					},
					children : [
						{
							el : 'p',
							attrs : {
								'id' : 'first-child'
							}
						}
					]
				};
				var el = MOD.core.dom.create( config );
				var child = document.createElement( 'p' );
				child.id = 'test-child';

				MOD.core.dom.append_elems( el, child );
				expect( el.lastChild.id ).toEqual( 'test-child' );
			});
		});

		describe( 'MOD.core.dom.prepend_elems', function () {
			it( 'should add child elements to the beginning of children of an element', function () {
				var config = {
					el : 'div',
					attrs : {
						'id' : 'test-parent'
					},
					children : [
						{
							el : 'p',
							attrs : {
								'id' : 'first-child'
							}
						}
					]
				};
				var el = MOD.core.dom.create( config );
				var child = document.createElement( 'p' );
				child.id = 'test-child';

				MOD.core.dom.prepend_elems( el, child );
				expect( el.firstChild.id ).toEqual( 'test-child' );
			});
		});
	});

	describe( 'MOD.core.util', function () {
		describe( 'MOD.core.util.to_string', function () {
			it( 'should convert other types to strings', function () {
				var arr = [ 1, 2, 3, 4 ];

				expect( MOD.core.util.to_string( arr ) ).toEqual( '1,2,3,4' );
			});
		});

		describe( 'MOD.core.util.trim', function () {
			it( 'should trim whitespace from the start and end of a string', function () {
				var str = "   Test string.   ";
				expect( MOD.core.util.trim( str ) ).toEqual( 'Test string.' );
			});
		});

		describe( 'MOD.core.util.to_camel_case', function () {
			it( 'should convert dash or space seperated words to camel-case words', function () {
				var str1 = "test-string", str2 = "test string";

				expect( MOD.core.util.to_camel_case( str1, '-' ) ).toEqual( 'testString' );
				expect( MOD.core.util.to_camel_case( str2, ' ' ) ).toEqual( 'testString' );
			});
		});

		describe( 'MOD.core.util.is_object', function () {
			it( 'should return true if test element is an object, else false', function () {
				var obj = {
					test : 'object'
				};
				var str = 'test-object';

				expect( MOD.core.util.is_object( obj ) ).toEqual( true );
				expect( MOD.core.util.is_object( str ) ).toEqual( false );
			});
		});

		describe( 'MOD.core.util.is_array', function () {
			it( 'should return true if test element is an array, else false', function () {
				var arr = [ 1, 2, 3 ];
				var str = 'test-object';

				expect( MOD.core.util.is_array( arr ) ).toEqual( true );
				expect( MOD.core.util.is_array( str ) ).toEqual( false );
			});
		});

		describe( 'MOD.core.util.array_contains', function () {
			it( 'should return true if the specified array contains a specified value, else false', function () {
				var arr = [ 1, 2, 3, 4, 5 ];

				expect( MOD.core.util.array_contains( arr, 2 ) ).toEqual( true );
				expect( MOD.core.util.array_contains( arr, 10 ) ).toEqual( false );
			});
		});

		describe( 'MOD.core.util.map', function () {
			it( 'should perform a function on each member of an enumerable object and return an array of results if function returns anything', function () {
				var looper = [
					{
						name : 'Kurt',
						age : 31,
						job : 'Front-end Web Developer'
					},
					{
						name : 'Jason',
						age : 28,
						job : 'Sr. Software Engineer'
					},
					{
						name : 'Tariq',
						age : 30,
						job : 'Software Engineer'
					}
				];

				function getNames ( item, index ) {
					return item.name;
				}

				function getAges ( item, index ) {
					return item.age;
				}

				function getJobs ( item, index ) {
					return item.job;
				}

				expect( MOD.core.util.map( looper, getNames ).toString() ).toEqual( 'Kurt,Jason,Tariq' );
				expect( MOD.core.util.map( looper, getAges ).toString() ).toEqual( '31,28,30' );
				expect( MOD.core.util.map( looper, getJobs ).toString() ).toEqual( 'Front-end Web Developer,Sr. Software Engineer,Software Engineer' );
			});
		});

		describe( 'MOD.core.util.ajax', function () {
			it( 'should make an ajax request', function () {
				var callback = jasmine.createSpy();

				var config = {
					url : 'jasmine-test.json',
					type : 'GET',
					dataType : 'JSON',
					done : callback,
					fail : function () {},
					scope : this
				};

				MOD.core.util.ajax( config );

				waitsFor(function () {
					return callback.callCount > 0;
				}, 'The ajax call failed', 5000 );

				runs(function () {
					expect( callback ).toHaveBeenCalled();
				});
			});
		});

		describe( 'MOD.core.util.isIE', function() {
			it( 'should return true if browser is specified version of IE or lower, false if not', function () {
				var ie7ua = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)';
				var ie8ua = 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; en-US)';
				var ie9ua = 'Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US)';
				var chromeUa = 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36';
				var ffUa = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0';

				expect( MOD.core.util.isIE( 8, ie7ua ) ).toEqual( true );
				expect( MOD.core.util.isIE( 6, ie7ua ) ).toEqual( false );
				expect( MOD.core.util.isIE( 8, ie8ua ) ).toEqual( true );
				expect( MOD.core.util.isIE( 9, ie9ua ) ).toEqual( true );
				expect( MOD.core.util.isIE( 9, ie8ua ) ).toEqual( true );
				expect( MOD.core.util.isIE( 9, chromeUa ) ).toEqual( false );
				expect( MOD.core.util.isIE( 9, ffUa ) ).toEqual( false );
			});
		});
	});
});