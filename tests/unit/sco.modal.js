$(function () {

	module('modal object', {
		teardown: function() {
			equal($('#modal').length, 0, 'no modal remaining after test');
			equal($('.modal-backdrop').length, 0, 'backdrop doesn\'t exist');
		}
	});

		test('should create html on call', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			}).show();
			equal($('#qunit-fixture').find('.modal').length, 1, '.modal created');
			equal($('#qunit-fixture').find('.modal-backdrop').length, 1, '.modal-backdrop created');
			equal($('#qunit-fixture').find('.modal .inner').text(), 'abcd', 'modal content is properly set');
			ok($('#qunit-fixture #modal').is(':visible'), 'modal is visible');
			$modal.destroy();
		});

		test('should be removed when close() is called', function() {
			var $modal = $.scojs_modal({
				content: 'abcd'
				,appendTo: '#qunit-fixture'
			}).show().close();
			equal($('#qunit-fixture #modal').length, 1, '#modal still exists');
			ok(!$('#qunit-fixture #modal').is(':visible'), '#modal is hidden');
			equal($('#qunit-fixture .modal-backdrop').length, 0, 'backdrop is removed');
			equal($('#qunit-fixture').find('.modal .inner').text(), '', 'modal content is cleaned');
			$modal.destroy();
		});

		test('should be removed when clicked on close', function() {
			var $modal = $.scojs_modal({
					content: 'abcd'
					,appendTo: '#qunit-fixture'
				}).show();
			$('#qunit-fixture #modal .close').trigger('click');
			ok(!$('#qunit-fixture #modal').is(':visible'), '#modal is hidden');
			equal($('#qunit-fixture #modal').length, 1, '#modal still exists');
			equal($('#qunit-fixture .modal-backdrop').length, 0, 'backdrop is removed');
			equal($('#qunit-fixture').find('.modal .inner').text(), '', 'modal content is cleaned');
			$modal.destroy();
		});

		test('cssclass should be removed between different modals using the same modal block', function() {
			var $modal = $.scojs_modal({
					content: 'abcd'
					,cssclass: 'test'
					,appendTo: '#qunit-fixture'
				}).show();
			ok($('#qunit-fixture #modal').hasClass('test'), 'class exists');
			$('#qunit-fixture #modal .close').trigger('click');
			ok(!$('#qunit-fixture #modal').hasClass('test'), 'class doesn\'t exists after close');
			var $modal = $.scojs_modal({
					content: 'abcd'
					,cssclass: 'foo'
					,appendTo: '#qunit-fixture'
				}).show();
			ok(!$('#qunit-fixture #modal').hasClass('test'), 'old class doesn\'t exists in the new modal');
			ok($('#qunit-fixture #modal').hasClass('foo'), 'new class exists');
			$('#qunit-fixture #modal .close').trigger('click');
			ok(!$('#qunit-fixture #modal').hasClass('foo'), 'class doesn\'t exists after close');
			$modal.destroy();
		});


	module('modal data-api');

		test('should be created on click', function() {
			var $fixture = $('#qunit-fixture');
			$fixture.append('<a href="#" id="link1" data-content="abcd" data-trigger="modal">click m3</a>');
			$fixture.find('#link1').trigger('click');
			equal($('#modal').length, 1, '.modal created');
			equal($('.modal-backdrop').length, 1, '.modal-backdrop created');
			equal($('.modal .inner').text(), 'abcd', 'modal content is properly set');
		});

		test('proper ajax loaded content', function() {
			var $fixture = $('#qunit-fixture');
			$fixture.append('<a href="modal_content.html" data-trigger="modal" id="link2">click me</a>');
			$('#link2').trigger('click');
			stop();
			setTimeout(function() {
				equal($('.modal .inner').html(), '<strong>abcd</strong>', 'modal content is properly set');
				ok($('#modal').is(':visible'), 'modal is visible');
				$('#link2').data('scojs_modal').close();
				ok(!$('#modal').is(':visible'), 'modal is invisible after close()');
				start();
			}, 1000);
		});
});
