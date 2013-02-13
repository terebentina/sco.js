$(function () {

	module('confirm object');

		test('should create html on call', function() {
			var $modal = $.scojs_confirm({
					action: '/bla'
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				});
			equal($('#confirm_modal.confirm_modal').length, 1, 'modal created');
			equal($('#confirm_modal').find('.inner').text(), 'abcdef', 'modal content is properly set');
			equal($('#confirm_modal').find('[data-action]').attr('href'), '/bla', 'proper href action');
			equal($('#confirm_modal').css('display'), 'none', 'modal is invisible when created');
			$modal.show();
			equal($('#confirm_modal').css('display'), 'block', 'modal is visible after show()');
		});

		test('should disappear on cancel click', function() {
			var $modal = $.scojs_confirm({
					action: '/bla'
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				});
			$modal.show();
			$('#confirm_modal').find('[data-dismiss]').trigger('click');
			equal($('#confirm_modal').length, 1, 'modal still exists');
			equal($('#confirm_modal').css('display'), 'none', 'modal is hidden');
			equal($('#confirm_modal .inner').text(), '', 'modal content is cleaned');
		});

		test('action as function should work', function() {
			var $modal = $.scojs_confirm({
					action: function() {
						$(document.body).append('<div class="test"/>');
					}
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				});
			$modal.show();
			equal($('.test').length, 0, 'nothing before clicking on action');
			equal($('#confirm_modal').find('[data-action]').attr('href'), '#', 'action href is #');
			$('#confirm_modal').find('[data-action]').trigger('click');
			equal($('.test').length, 1, 'action worked properly after click');
			$('.test').remove();
		});

		test('there should be just 1 action event', function() {
			var $modal1 = $.scojs_confirm({
					action: function() {
						$(document.body).append('<div class="test"/>');
					}
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				})
				,$modal2 = $.scojs_confirm({
					action: function() {
						$(document.body).append('<div class="test"/>');
					}
					,content: 'abcdef'
					,appendTo: '#qunit-fixture'
				})
				;
			$modal1.show();
			$modal2.show();
			equal($('.test').length, 0, 'nothing before clicking on action');
			$('#confirm_modal').find('[data-action]').trigger('click');
			equal($('.test').length, 1, 'action worked properly after click');
			$('.test').remove();
		});
});
