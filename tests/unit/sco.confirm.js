$(function () {

	module('confirm object', {
		teardown: function() {
			equal($('#confirm_modal').length, 0, 'no modal remaining after test');
			equal($('.modal-backdrop').length, 0, 'backdrop doesn\'t exist');
		}
	});

		test('should create html on call', function() {
			var $modal = $.scojs_confirm({
					action: '/bla'
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				}).show();
			equal($('#qunit-fixture #confirm_modal.confirm_modal').length, 1, 'modal created');
			equal($('#qunit-fixture #confirm_modal').find('.inner').text(), 'abcdef', 'modal content is properly set');
			equal($('#qunit-fixture #confirm_modal').find('[data-action]').attr('href'), '/bla', 'proper href action');
			ok($('#qunit-fixture #confirm_modal').is(':visible'), 'modal is visible after show()');
			$modal.destroy();
		});

		test('should disappear on cancel click', function() {
			var $modal = $.scojs_confirm({
					action: '/bla'
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				}).show();
			$('#confirm_modal').find('[data-dismiss]').trigger('click');
			equal($('#confirm_modal').length, 1, 'modal still exists');
			ok(!$('#confirm_modal').is(':visible'), 'modal is hidden');
			equal($('#confirm_modal .inner').text(), '', 'modal content is cleaned');
			$modal.destroy();
		});

		test('action as function should work', function() {
			var $modal = $.scojs_confirm({
					action: function() {
						$(document.body).append('<div class="test"/>');
					}
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				}).show();
			equal($('.test').length, 0, 'nothing before clicking on action');
			equal($('#confirm_modal').find('[data-action]').attr('href'), '#', 'action href is #');
			$('#confirm_modal').find('[data-action]').trigger('click');
			equal($('.test').length, 1, 'action worked properly after click');
			$('.test').remove();
			$modal.destroy();
		});

		test('there should be just 1 action event', function() {
			var $modal1 = $.scojs_confirm({
					action: function() {
						$(document.body).append('<div class="test"/>');
					}
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				}).show()
				,$modal2 = $.scojs_confirm({
					action: function() {
						$(document.body).append('<div class="test"/>');
					}
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				}).show()
				;
			equal($('.test').length, 0, 'nothing before clicking on action');
			$('#confirm_modal').find('[data-action]').trigger('click');
			equal($('.test').length, 1, 'action worked properly after click');
			$('.test').remove();
			$modal1.destroy();
			$modal2.destroy();
		});

	module('confirm data-api');

		test('should be created on click', function() {
			var $fixture = $('#qunit-fixture');
			$fixture.append('<a href="#" id="link" data-trigger="confirm" data-append-to="#qunit-fixture">click me</a>');
			$fixture.find('#link').trigger('click');
			equal($('#confirm_modal').length, 1, '.modal created');
			equal($('.modal-backdrop').length, 1, '.modal-backdrop created');
			equal($('.modal .inner').text(), 'Are you sure you want to delete this?', 'modal content is properly set');
		});

});
