$(function () {

	module('tab object');

		test('init should add some classes', function() {
			var $fixture = $('#qunit-fixture').append('<ul id="headers"><li><a href="#">header 1</a></li><li><a href="#"><a href="#">header 2</a></li><li><a href="#">header 3</a></li></ul><div class="pane-wrapper"><div>content 1</div><div>content 2</div><div>content 3</div></div>')
				,$tab = $.scojs_tab('#headers', {content: '.pane-wrapper'});
			ok($('#qunit-fixture #headers > li').eq(0).hasClass('active'), 'first tab is active');
			ok($('#qunit-fixture .pane-wrapper > div').eq(0).hasClass('active'), 'first pane is active');
		});

		test('should work with no options', function() {
			var $fixture = $('#qunit-fixture').append('<ul id="headers"><li><a href="#">header 1</a></li><li><a href="#"><a href="#">header 2</a></li><li><a href="#">header 3</a></li></ul><div class="pane-wrapper"><div>content 1</div><div>content 2</div><div>content 3</div></div>')
				,$tab = $.scojs_tab('#headers');
			ok($('#qunit-fixture #headers > li').eq(0).hasClass('active'), 'first tab is active');
			ok($('#qunit-fixture .pane-wrapper > div').eq(0).hasClass('active'), 'first pane is active');
		});

		test('should work with headers under panes', function() {
			var $fixture = $('#qunit-fixture').append('<div class="pane-wrapper"><div>content 1</div><div>content 2</div><div>content 3</div></div><ul id="headers"><li><a href="#">header 1</a></li><li><a href="#"><a href="#">header 2</a></li><li><a href="#">header 3</a></li></ul>')
				,$tab = $.scojs_tab('#headers', {mode: 'prev'});
			ok($('#qunit-fixture #headers > li').eq(0).hasClass('active'), 'first tab is active');
			ok($('#qunit-fixture .pane-wrapper > div').eq(0).hasClass('active'), 'first pane is active');
		});

		test('select() should switch .active', function() {
			var $fixture = $('#qunit-fixture').append('<ul id="headers"><li><a href="#">header 1</a></li><li><a href="#"><a href="#">header 2</a></li><li><a href="#">header 3</a></li></ul><div class="pane-wrapper"><div>content 1</div><div>content 2</div><div>content 3</div></div>')
				,$tab = $.scojs_tab('#headers', {content: '.pane-wrapper'}).select(1);
			ok(!$('#qunit-fixture li').eq(0).hasClass('active'), 'first tab is not active - header');
			ok(!$('#qunit-fixture .pane-wrapper div').eq(0).hasClass('active'), 'first tab is not active - pane');
			ok($('#qunit-fixture li').eq(1).hasClass('active'), '2nd tab is active - header');
			ok($('#qunit-fixture .pane-wrapper div').eq(1).hasClass('active'), '2nd tab is active - pane');
		});


	module('tab callbacks');

		test('onBeforeSelect() can block selection', function() {
			var $fixture = $('#qunit-fixture').append('<ul id="headers"><li><a href="#">header 1</a></li><li><a href="#"><a href="#">header 2</a></li><li><a href="#">header 3</a></li></ul><div class="pane-wrapper"><div>content 1</div><div>content 2</div><div>content 3</div></div>')
				,$tab = $.scojs_tab('#headers', {
					content: '.pane-wrapper'
					,onBeforeSelect: function(idx) {
						if (idx == 2) {
							return false;
						}
					}
				}).select(1);
			ok($('#qunit-fixture #headers > li').eq(1).hasClass('active'), '2nd tab selection not blocked - header');
			ok($('#qunit-fixture .pane-wrapper > div').eq(1).hasClass('active'), '2nd tab selection not blocked - pane');
			$tab.select(2);
			ok($('#qunit-fixture #headers > li').eq(1).hasClass('active'), '3rd tab selection blocked - active class stays with 2nd - header');
			ok($('#qunit-fixture .pane-wrapper > div').eq(1).hasClass('active'), '3rd tab selection blocked - active class stays with 2nd - pane');
			ok(!$('#qunit-fixture #headers > li').eq(2).hasClass('active'), '3rd tab selection blocked - no .active for 3rd header');
			ok(!$('#qunit-fixture .pane-wrapper > div').eq(2).hasClass('active'), '3rd tab selection blocked - no .active for 3rd pane');
		});


	module('tab data-api');

		test('should default to first tab', function() {
			var $fixture = $('#qunit-fixture').append('<ul data-trigger="tab"><li><a href="#">header 1</a></li><li><a href="#"><a href="#">header 2</a></li><li><a href="#">header 3</a></li></ul><div class="pane-wrapper"><div>content 1</div><div>content 2</div><div>content 3</div></div>')
			$('[data-trigger="tab"]').scojs_tab();
			ok($('#qunit-fixture ul > li').eq(0).hasClass('active'), 'first tab is active');
			ok($('#qunit-fixture .pane-wrapper > div').eq(0).hasClass('active'), 'first pane is active');
		});

		test('click on headers should switch tabs', function() {
			var $fixture = $('#qunit-fixture').append('<ul data-trigger="tab"><li><a href="#">header 1</a></li><li><a href="#"><a href="#">header 2</a></li><li><a href="#">header 3</a></li></ul><div class="pane-wrapper"><div>content 1</div><div>content 2</div><div>content 3</div></div>')
			$('[data-trigger="tab"]').scojs_tab();
			$('#qunit-fixture ul > li a').eq(1).trigger('click');
			ok(!$('#qunit-fixture ul > li').eq(0).hasClass('active'), 'first tab is not active - header');
			ok(!$('#qunit-fixture .pane-wrapper > div').eq(0).hasClass('active'), 'first tab is not active - pane');
			ok($('#qunit-fixture ul > li').eq(1).hasClass('active'), '2nd tab is active - header');
			ok($('#qunit-fixture .pane-wrapper > div').eq(1).hasClass('active'), '2nd tab is active - pane');
		});
});
