$(function () {

	$.mockjax({
		url: /methods\/norules/
		,contentType: 'text/json'
		,response: function() {
			this.responseText = {status: 'success', data: {}};
			start();
			ok(true, 'ajax ran');
		}
	});

	module('valid methods');

		test('should validate without rules', function() {
			var $form = $('<form id="form" action="methods/norules" method="post"><input type="email"></form>');

			expect(1);
			$form.scojs_valid({});
			var validator = $form.data('scojs_valid');
			stop();
			$form.submit();
		});

		test('not_empty', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['not_empty']}});
			var validator = $form.data('scojs_valid');
			ok(!validator.validate(), 'empty should not pass');
			$field.val('abc');
			ok(validator.validate(), 'not empty should pass');
		});

		test('min_length', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: [{'min_length': 4}]}});
			var validator = $form.data('scojs_valid');
			ok(validator.validate(), 'empty should pass');
			$field.val('abc');
			ok(!validator.validate(), 'under min length should not pass');
			$field.val('abcd');
			ok(validator.validate(), 'min length should pass');
			$field.val('abcde');
			ok(validator.validate(), 'more than min length should pass');
		});

		test('max_length', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: [{'max_length': 4}]}});
			var validator = $form.data('scojs_valid');
			ok(validator.validate(), 'empty should pass');
			$field.val('abcde');
			ok(!validator.validate(), 'over max length should not pass');
			$field.val('abcd');
			ok(validator.validate(), 'max length should pass');
			$field.val('abc');
			ok(validator.validate(), 'less than max length should pass');
		});

		test('regex', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: [{'regex': /@/}]}});
			var validator = $form.data('scojs_valid');
			$field.val('abc');
			ok(!validator.validate(), 'invalid value should not pass');
			$field.val('a@c');
			ok(validator.validate(), 'valid value should pass');
		});

		test('email', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['email']}});
			var validator = $form.data('scojs_valid');
			$field.val('abc');
			ok(!validator.validate(), 'invalid value should not pass 1');
			$field.val('abc@def.');
			ok(!validator.validate(), 'invalid value should not pass 2');
			$field.val('@def.com');
			ok(!validator.validate(), 'invalid value should not pass 3');
			$field.val('abc@def.foo');
			ok(validator.validate(), 'valid value should pass');
		});

		test('url', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;
			// tests taken from jquery form validation plugin and adapted for scojs valid
			$form.scojs_valid({rules: {field: ['url']}});
			var validator = $form.data('scojs_valid');
			$field.val("http://bassistance.de/jquery/plugin.php?bla=blu");
			ok( validator.validate(), 'valid value should pass 1');
			$field.val("https://bassistance.de/jquery/plugin.php?bla=blu");
			ok( validator.validate(), 'valid value should pass 2');
			$field.val("ftp://bassistance.de/jquery/plugin.php?bla=blu");
			ok( validator.validate(), 'valid value should pass 3');
			$field.val("http://www.føtex.dk/");
			ok( validator.validate(), 'valid value should pass 4');
			$field.val("http://bösendorfer.de/");
			ok( validator.validate(), 'valid value should pass 5');
			$field.val("http://192.168.8.5");
			ok( validator.validate(), 'valid value should pass 6');

			$field.val("http://192.168.8.");
			ok(!validator.validate(), 'invalid value should not pass 1');
			$field.val("http://bassistance");
			ok(!validator.validate(), 'invalid value should not pass 2');
			$field.val("http://bassistance.");
			ok(!validator.validate(), 'invalid value should not pass 3');
			$field.val("http://bassistance,de");
			ok(!validator.validate(), 'invalid value should not pass 4');
			$field.val("http://bassistance;de");
			ok(!validator.validate(), 'invalid value should not pass 5');
			$field.val("http://.bassistancede");
			ok(!validator.validate(), 'invalid value should not pass 6');
			$field.val("bassistance.de");
			ok(!validator.validate(), 'invalid value should not pass 7');
		});

		test('exact_length', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: [{'exact_length': 4}]}});
			var validator = $form.data('scojs_valid');
			ok(validator.validate(), 'empty should pass');
			$field.val('abc');
			ok(!validator.validate(), 'under length should not pass');
			$field.val('abcde');
			ok(!validator.validate(), 'over length should not pass');
			$field.val('abcd');
			ok(validator.validate(), 'exact length should pass');
		});

		test('equals', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: [{'equals': 'foo'}]}});
			var validator = $form.data('scojs_valid');
			ok(!validator.validate(), 'empty should not pass');
			$field.val('abc');
			ok(!validator.validate(), 'different value should not pass');
			$field.val('foo');
			ok(validator.validate(), 'exact value should pass');
		});

		test('ip', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['ip']}});
			var validator = $form.data('scojs_valid');
			ok(!validator.validate(), 'empty should not pass');
			$field.val('abc');
			ok(!validator.validate(), 'invalid value should not pass 1');
			$field.val("192.168.8.");
			ok(!validator.validate(), 'invalid value should not pass 2');
			$field.val("192.168.8.5");
			ok( validator.validate(), 'valid value should pass');
		});

		test('credit_card', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['credit_card']}});
			var validator = $form.data('scojs_valid');
			ok( validator.validate(), 'empty should pass');
			$field.val('4111 1111 1111 1111');
			ok( validator.validate(), 'mastercard should pass');
			$field.val('446-667-651');
			ok( validator.validate(), 'valid should pass');
			$field.val('foo');
			ok(!validator.validate(), 'invalid should not pass');
		});

		test('alpha', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['alpha']}});
			var validator = $form.data('scojs_valid');
			ok( validator.validate(), 'empty should pass');
			$field.val('abc');
			ok( validator.validate(), 'valid should pass');
			$field.val('abc123');
			ok(!validator.validate(), 'invalid should not pass');
		});

		test('alpha_numeric', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['alpha_numeric']}});
			var validator = $form.data('scojs_valid');
			ok( validator.validate(), 'empty should pass');
			$field.val('123');
			ok( validator.validate(), 'valid should pass');
			$field.val('abc');
			ok( validator.validate(), 'valid should pass');
			$field.val('b123a');
			ok( validator.validate(), 'valid should pass');
			$field.val('b123a ');
			ok(!validator.validate(), 'invalid should not pass');
		});

		test('alpha_dash', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['alpha_dash']}});
			var validator = $form.data('scojs_valid');
			ok( validator.validate(), 'empty should pass');
			$field.val('123');
			ok( validator.validate(), 'valid should pass');
			$field.val('abc');
			ok( validator.validate(), 'valid should pass');
			$field.val('b123a');
			ok( validator.validate(), 'valid should pass');
			$field.val('b123a ');
			ok(!validator.validate(), 'invalid should not pass');
			$field.val('b1_23-a');
			ok( validator.validate(), 'valid should pass');
		});

		test('digit', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['digit']}});
			var validator = $form.data('scojs_valid');
			ok( validator.validate(), 'empty should pass');
			$field.val('1234');
			ok( validator.validate(), 'valid should pass');
			$field.val(' ');
			ok(!validator.validate(), 'invalid should not pass');
			$field.val('123a');
			ok(!validator.validate(), 'invalid should not pass');
		});

		test('numeric', function() {
			var  $form = $('<form><input name="field"></form>')
				,$field = $form.find('[name="field"]')
				;

			$form.scojs_valid({rules: {field: ['numeric']}});
			var validator = $form.data('scojs_valid');
			ok( validator.validate(), 'empty should pass');
			$field.val('-123235245.6666');
			ok( validator.validate(), 'should pass');
			$field.val('123235245.6666');
			ok( validator.validate(), 'should pass');
			$field.val('-123235245.6666a');
			ok(!validator.validate(), 'should not pass');
			$field.val('a');
			ok(!validator.validate(), 'should not pass');
		});

		test('matches', function() {
			var  $form = $('<form><input name="field1"><input name="field2"></form>')
				,$field1 = $form.find('[name="field1"]')
				,$field2 = $form.find('[name="field2"]')
				;

			$form.scojs_valid({rules: {field2: [{'matches': 'field1'}]}});
			var validator = $form.data('scojs_valid');
			ok( validator.validate(), 'both empty should pass');
			$field1.val('abc');
			ok(!validator.validate(), 'different values should not pass');
			$field2.val('abcd');
			ok(!validator.validate(), 'different values should not pass');
			$field2.val('abc');
			ok( validator.validate(), 'same should pass');
			$field1.val('');
			ok(!validator.validate(), 'different values should not pass');
		});
});
