describe( 'MOD.form', function () {
	var form, mod_form;

	beforeEach(function () {
		var config = {
			el : 'form',
			attrs : {
				id : 'jasmine-test-form',
				method : 'POST',
				action : '//process-form.php'
			},
			children : [
				{
					el : 'input',
					attrs : {
						'type' : 'text',
						'name' : 'text-input',
						'value' : 'sample-text-input',
						'id' : 'text-input'
					}
				},
				{
					el : 'textarea',
					text : 'sample-text-area',
					attrs : {
						'name' : 'textarea',
						'id' : 'textarea'
					}
				},
				{
					el : 'input',
					attrs : {
						'type' : 'checkbox',
						'name' : 'checkbox',
						'value' : 'checkbox',
						'id' : 'checkbox'
					}
				},
				{
					el : 'input',
					attrs : {
						'type' : 'radio',
						'name' : 'radio-group',
						'value' : '1',
						'id' : 'radio1'
					}
				},
				{
					el : 'input',
					attrs : {
						'type' : 'radio',
						'name' : 'radio-group',
						'value' : '2',
						'id' : 'radio2'
					}
				},
				{
					el : 'select',
					attrs : {
						'name' : 'select',
						'id' : 'select'
					},
					children : [
						{
							el : 'option',
							attrs : {
								'value' : '1'
							}
						},
						{
							el : 'option',
							attrs : {
								'value' : '2'
							}
						},
						{
							el : 'option',
							attrs : {
								'value' : '3'
							}
						}
					]
				}
			]
		}
		form = MOD.core.dom.create( config );
		mod_form = new MOD.form( form );
	});

	it( 'should return an object with form helper functions', function () {
		expect( mod_form.validate ).toBeDefined();
		expect( mod_form.prep ).toBeDefined();
	});

	describe( 'MOD.form.check.required', function () {
		it( 'should check for values on required text inputs', function() {
			var input = form['text-input'];

			MOD.core.dom.apply_attrs( input, {
				'class' : 'required validate'
			});
			input.value = '';
			expect( mod_form.validate() ).toEqual( false );

			input.value = 'sample-text-input';
			expect( mod_form.validate() ).toEqual( true );
		});

		it( 'should check for values on required checkbox inputs', function() {
			var input = form['checkbox'];

			MOD.core.dom.apply_attrs( input, {
				'class' : 'required validate'
			});
			expect( mod_form.validate() ).toEqual( false );
		});

		it( 'should check for values on required radio input groups', function() {
			var radios = form['radio-group'];

			MOD.core.util.map( radios, function ( radio, item ) {
				MOD.core.dom.apply_attrs( radio, {
					'class' : 'required validate'
				});
			});
			expect( mod_form.validate() ).toEqual( false );

			radios[0].checked = true;
			expect( mod_form.validate() ).toEqual( true );
		});

		it( 'should check for values on required textareas', function() {
			var textarea = form['textarea'];

			MOD.core.dom.apply_attrs( textarea, {
				'class' : 'required validate'
			});

			expect( mod_form.validate() ).toEqual( true );

			textarea.innerHTML = null;
			expect( mod_form.validate() ).toEqual( false );
		});

		it( 'should check for values on required selects', function() {
			var select = form['select'];

			MOD.core.dom.apply_attrs( select, {
				'class' : 'required validate'
			});

			select.options.selectedIndex = -1;
			expect( mod_form.validate() ).toEqual( false );

			select.options[0].selected = true;
			expect( mod_form.validate() ).toEqual( true );
		});
	});

	describe( 'MOD.form.check.email', function () {
		it( 'should validate correct email addresses', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'email validate'
			});
			expect( mod_form.validate() ).toEqual( false );

			input.value = 'test@kurtiskemple.com';
			expect( mod_form.validate() ).toEqual( true );
		});
	});

	describe( 'MOD.form.check.phone', function () {
		it( 'should validate correct phone numbers', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'phone validate'
			});
			expect( mod_form.validate() ).toEqual( false );

			input.value = '555-555-1212';
			expect( mod_form.validate() ).toEqual( true );

			input.value = '(555) 555-1212';
			expect( mod_form.validate() ).toEqual( true );

			input.value = '555 555 1212';
			expect( mod_form.validate() ).toEqual( true );

			input.value = '555.555.1212';
			expect( mod_form.validate() ).toEqual( true );
		});
	});

	describe( 'MOD.form.check.url', function () {
		it( 'should validate correct urls', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'url validate'
			});
			expect( mod_form.validate() ).toEqual( false );

			input.value = 'www.google.com';
			expect( mod_form.validate() ).toEqual( true );

			input.value = 'google.com/docs/';
			expect( mod_form.validate() ).toEqual( true );

			input.value = 'http://google.com/api/v1/';
			expect( mod_form.validate() ).toEqual( true );
		});
	});

	describe( 'MOD.form.check.credit_card', function () {
		it( 'should validate 16 digit number', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'creditcard validate'
			});
			expect( mod_form.validate() ).toEqual( false );

			input.value = '1212121212121212';
			expect( mod_form.validate() ).toEqual( true );
		});
	});

	describe( 'MOD.form.check.min_length', function () {
		it( 'should validate field has required minimum number of characters', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'minlength validate',
				'data-minlength' : '4'
			});
			expect( mod_form.validate() ).toEqual( true );

			input.value = '123';
			expect( mod_form.validate() ).toEqual( false );
		});
	});

	describe( 'MOD.form.check.max_length', function () {
		it( 'should validate field has maximum number of characters or less', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'maxlength validate',
				'data-maxlength' : '10'
			});
			expect( mod_form.validate() ).toEqual( false );

			input.value = '123';
			expect( mod_form.validate() ).toEqual( true );
		});
	});

	describe( 'MOD.form.check.equal_to', function () {
		it( 'should validate field has exact number of characters', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'equalto validate',
				'data-equalto' : '4'
			});
			expect( mod_form.validate() ).toEqual( false );

			input.value = '1234';
			expect( mod_form.validate() ).toEqual( true );
		});
	});

	describe( 'MOD.form.set_error', function () {
		it( 'should add error messages to the form if validation fails', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'required validate'
			});

			input.value = '';
			mod_form.validate();

			var errors = form.getElementsByClassName( 'error' );
			expect( errors ).toBeDefined();
		});

		it( 'should add error class to failing element', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'required validate'
			});

			input.value = '';
			mod_form.validate();

			expect( MOD.core.dom.has_class( input, 'error' ) ).toEqual( true );
		});
	});

	describe( 'MOD.form.clear_errors', function () {
		it( 'should remove error messages from the form', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'required validate'
			});

			input.value = '';
			mod_form.validate();

			input.value = 'pass';
			mod_form.validate();

			var errors = form.getElementsByClassName( 'error' );
			expect( errors.length ).toEqual( 0 );
		});

		it( 'should remove error class from elements', function () {
			var input = form['text-input'];
			MOD.core.dom.apply_attrs( input, {
				'class' : 'required validate'
			});

			input.value = '';
			mod_form.validate();

			input.value = 'pass';
			mod_form.validate();

			expect( MOD.core.dom.has_class( input, 'error' ) ).toEqual( false );
		});
	});

	describe( 'MOD.form.prep', function () {
		it( 'should return a name/value pair string of all elements in the form', function () {
			var data = mod_form.prep( true );

			expect( typeof data ).toEqual( 'string' );
		});

		it( 'should return a name/value pair JSON object of all elements in the form', function () {
			var data = mod_form.prep();
			data = JSON.parse( data )

			expect( data['text-input'] ).toEqual( 'sample-text-input' );
		});
	});

});