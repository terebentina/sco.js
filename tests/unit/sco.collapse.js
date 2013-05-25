$(function () {

	module('collapse object');

		test('should toggle the target on toggle()', function() {
			var $fixture = $('#qunit-fixture').append('<a href="#" id="link">click me</a><div class="collapsible" style="display:none">content</div>');
			var $collapse = $.scojs_collapse('#link', {ease: ''}).toggle();
			ok($('#qunit-fixture .collapsible').is(':visible'), 'visible on first toggle');
			$collapse.toggle();
			ok(!$('#qunit-fixture .collapsible').is(':visible'), 'invisible on second toggle');
		});

		test('should toggle the previous target on toggle()', function() {
			var $fixture = $('#qunit-fixture').append('<div class="collapsible" style="display:none">content</div><a href="#" id="link">click me</a>');
			var $collapse = $.scojs_collapse('#link', {ease: '', mode: 'prev'}).toggle();
			ok($('#qunit-fixture .collapsible').is(':visible'), 'visible on first toggle');
			$collapse.toggle();
			ok(!$('#qunit-fixture .collapsible').is(':visible'), 'invisible on second toggle');
		});

		test('should toggle when it is default opened', function() {
			var $fixture = $('#qunit-fixture').append('<a href="#" id="link" class="active">click me</a><div class="collapsible">content</div>');
			var $collapse = $.scojs_collapse('#link', {ease: ''}).toggle();
			ok(!$('#qunit-fixture .collapsible').is(':visible'), 'invisible on first toggle');
			$collapse.toggle();
			ok($('#qunit-fixture .collapsible').is(':visible'), 'visible on second toggle');
		});

		test('should toggle when target is specified', function() {
			var $fixture = $('#qunit-fixture').append('<a href="#" id="link">click me</a><div class="ignored">ignore me</div><div class="foo" style="display:none">content</div>');
			var $collapse = $.scojs_collapse('#link', {ease: '', target: '.foo'}).toggle();
			ok($('#qunit-fixture .foo').is(':visible'), 'visible on first toggle');
			ok($('#qunit-fixture .ignored').is(':visible'), '.ignored is not affected on first toggle');
			$collapse.toggle();
			ok(!$('#qunit-fixture .foo').is(':visible'), 'invisible on second toggle');
			ok($('#qunit-fixture .ignored').is(':visible'), '.ignored is not affected on second toggle');
		});


	module('collapse data-api');

		test('should toggle the target on click', function() {
			var $fixture = $('#qunit-fixture').append('<a href="#" id="link" data-trigger="collapse" data-ease="">click me</a><div class="collapsible" style="display:none">content</div>');
			$('#qunit-fixture #link').trigger('click');
			ok($('#qunit-fixture .collapsible').is(':visible'), 'visible on first click');
			$('#qunit-fixture #link').trigger('click');
			ok(!$('#qunit-fixture .collapsible').is(':visible'), 'invisible on second click');
		});

		test('should toggle all in accordion mode', function() {
			var $fixture = $('#qunit-fixture').append('<a href="#" id="link1" data-trigger="collapse" data-ease="" data-parent="#qunit-fixture">click me</a><div class="collapsible" style="display:none">content</div><a href="#" id="link2" data-trigger="collapse" data-ease="" data-parent="#qunit-fixture" class="active">click me</a><div class="collapsible">content</div>');
			$('#qunit-fixture #link1').trigger('click');
			ok($('#qunit-fixture #link1').hasClass('active'), 'clicked link should have class .active');
			ok($('#qunit-fixture .collapsible').eq(0).is(':visible'), 'first collapsible should be visible');
			ok(!$('#qunit-fixture #link2').hasClass('active'), 'other link should NOT have class .active');
			ok(!$('#qunit-fixture .collapsible').eq(1).is(':visible'), 'second collapsible should NOT be visible');
			$('#qunit-fixture #link1').trigger('click');
			ok(!$('#qunit-fixture #link1').hasClass('active'), 'after second click, the clicked link should NOT have class .active');
			ok(!$('#qunit-fixture .collapsible').eq(0).is(':visible'), 'first collapsible should NOT be visible');
			ok(!$('#qunit-fixture #link2').hasClass('active'), 'other link should NOT have class .active');
			ok(!$('#qunit-fixture .collapsible').eq(1).is(':visible'), 'second collapsible should NOT be visible');
			$('#qunit-fixture #link2').trigger('click');
			ok(!$('#qunit-fixture #link1').hasClass('active'), 'after third click, the first link should NOT have class .active');
			ok(!$('#qunit-fixture .collapsible').eq(0).is(':visible'), 'after third click, first collapsible should NOT be visible');
			ok($('#qunit-fixture #link2').hasClass('active'), 'after third click, other link should have class .active');
			ok($('#qunit-fixture .collapsible').eq(1).is(':visible'), 'after third click, second collapsible should be visible');
		});
});
