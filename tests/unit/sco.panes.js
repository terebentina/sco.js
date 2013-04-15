$(function () {

	module('panes basics');

		test('init should add some classes', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper', {easing: 'xfade'});
			ok($('#qunit-fixture #wrapper').hasClass('xfade'), 'easing class added');
			ok($('#qunit-fixture #wrapper div').eq(0).hasClass('active'), 'active class added');
		});

		test('should add .active to the proper pane based on options', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper', {easing: '', active: 1});
			ok($('#qunit-fixture #wrapper div').eq(1).hasClass('active'), 'active class added');
		});

		test('should add .active to the proper pane based on options', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper', {active: 1});
			ok($('#qunit-fixture #wrapper div').eq(1).hasClass('active'), 'active class added');
		});

		test('select() should change the active pane', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper', {active: 1}).select(2);
			ok(!$('#qunit-fixture #wrapper div').eq(1).hasClass('active'), 'old pane doesn\'t have class');
			ok($('#qunit-fixture #wrapper div').eq(2).hasClass('active'), 'new pane has class');
		});

		test('next() should change the active pane', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper').next();
			ok(!$('#qunit-fixture #wrapper div').eq(0).hasClass('active'), 'old pane doesn\'t have class');
			ok($('#qunit-fixture #wrapper div').eq(1).hasClass('active'), 'new pane has class');
		});

		test('next() on last should go to first', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper', {active: 2}).next();
			ok(!$('#qunit-fixture #wrapper div').eq(2).hasClass('active'), 'old pane doesn\'t have class');
			ok($('#qunit-fixture #wrapper div').eq(0).hasClass('active'), 'new pane has class');
		});

		test('prev() should change the active pane', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper', {active: 2}).prev();
			ok(!$('#qunit-fixture #wrapper div').eq(2).hasClass('active'), 'old pane doesn\'t have class');
			ok($('#qunit-fixture #wrapper div').eq(1).hasClass('active'), 'new pane has class');
		});

		test('prev() on first should go to last', function() {
			var $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>');
			var $panes = $.scojs_panes('#wrapper').prev();
			ok(!$('#qunit-fixture #wrapper div').eq(0).hasClass('active'), 'old pane doesn\'t have class');
			ok($('#qunit-fixture #wrapper div').eq(2).hasClass('active'), 'new pane has class');
		});


	module('panes callbacks');

		test('onBeforeSelect() can block selection', function() {
			var  $fixture = $('#qunit-fixture').append('<div id="wrapper"><div>content</div><div>content</div><div>content</div></div>')
				,$panes = $.scojs_panes('#wrapper', {
					onBeforeSelect: function(idx) {
						if (idx == 2) {
							return false;
						}
					}
				});
			$panes.next();
			ok($('#qunit-fixture #wrapper div').eq(1).hasClass('active'), '2nd pane selection not blocked');
			$panes.next();
			ok($('#qunit-fixture #wrapper div').eq(1).hasClass('active'), '3rd pane selection blocked - active class stays with 2nd');
			ok(!$('#qunit-fixture #wrapper div').eq(2).hasClass('active'), '3rd pane selection blocked - no active class for 3rd');
		});
});
