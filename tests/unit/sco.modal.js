$(function () {

	module('sco.modal object');

		test('should create html on call', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			});
			equal($('#qunit-fixture').find('.modal').length, 1, '.modal created');
			equal($('#qunit-fixture').find('.modal-backdrop').length, 1, '.modal-backdrop created');
			equal($('#qunit-fixture').find('.modal .inner').text(), 'abcd', 'modal content is properly set');
		});

		test('should be invisible by default', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			});
			equal($('#modal').css('display'), 'none', 'modal is invisible when created');
		});

		test('should become visible when show() is called', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			});
			$modal.show();
			equal($('#modal').css('display'), 'block', 'modal is visible when show() is called');
		});

		test('should be removed when close() is called', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			});
			$modal.close();
			equal($('#modal').length, 1, '#modal still exists');
			equal($('#modal').css('display'), 'none', '#modal is hidden');
			equal($('.modal-backdrop').length, 0, 'backdrop is removed');
			equal($('#qunit-fixture').find('.modal .inner').text(), '', 'modal content is cleaned');
		});

		test('should be removed when clicked on close', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			});
			$('#modal').find('.close').trigger('click');
			equal($('#modal').length, 1, '#modal still exists');
			equal($('#modal').css('display'), 'none', '#modal is hidden');
			equal($('.modal-backdrop').length, 0, 'backdrop is removed');
			equal($('#qunit-fixture').find('.modal .inner').text(), '', 'modal content is cleaned');
		});

		test('should be destroyed', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			});
			$modal.destroy();
			equal($('#modal').length, 0, '#modal doesn\'t exists');
			equal($('.modal-backdrop').length, 0, 'backdrop doesn\'t exist');
		});



	module('sco.modal data-api');

		test('should be created on click', function() {
			var $fixture = $('#qunit-fixture');
			$fixture.append('<a href="#" data-trigger="modal" data-content="abcd" id="link">click me</a>');
			$('#link').trigger('click');
			equal($('#modal').length, 1, '.modal created');
			equal($('.modal-backdrop').length, 1, '.modal-backdrop created');
			equal($('.modal .inner').text(), 'abcd', 'modal content is properly set');
		});

		asyncTest('proper ajax loaded content', function() {
			var $fixture = $('#qunit-fixture');
			$fixture.append('<a href="modal_content.html" data-trigger="modal" id="link">click me</a>');
			$('#link').trigger('click');
			setTimeout(function() {
				equal($('.modal .inner').html(), '<strong>abcd</strong>', 'modal content is properly set');
				equal($('#modal').css('display'), 'block', 'modal is visible');
				$('#link').data('scojs_modal').close();
				equal($('#modal').css('display'), 'none', 'modal is invisible after close()');
				start();
			}, 1000);
		});
});
