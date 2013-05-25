$(function () {

	module('tooltip object');

		test('should create tooltip html on init', function() {
			var $tooltip = $.scojs_tooltip(null, {content: 'abcd', appendTo: '#qunit-fixture'});
			equal($('#qunit-fixture .tooltip').length, 1, 'tooltip is added');
			ok(!$('#qunit-fixture .tooltip').is(':visible'), 'tooltip is invisible');
			equal($('#qunit-fixture .tooltip span').text(), 'abcd', 'tooltip content is properly set');
		});

		test('should get the content from contentAttr', function() {
			var $fixture = $('#qunit-fixture').append('<a href="" tooltip="abcd">boo</a>')
				,$tooltip = $.scojs_tooltip('#qunit-fixture a', {contentAttr: 'tooltip', appendTo: '#qunit-fixture'});
			equal($('#qunit-fixture .tooltip span').text(), 'abcd', 'ok');
		});

		test('should get the content from contentElem', function() {
			var $fixture = $('#qunit-fixture').append('<a href="" id="link">boo</a>')
				,$tooltip = $.scojs_tooltip('#qunit-fixture a', {contentElem: '#link', appendTo: '#qunit-fixture'});
			equal($('#qunit-fixture .tooltip span').text(), 'boo', 'ok');
		});

		test('should set the css class', function() {
			var $tooltip = $.scojs_tooltip(null, {content: 'abcd', appendTo: '#qunit-fixture', cssclass: 'test'});
			ok($('#qunit-fixture .tooltip').hasClass('test'), 'ok');
		});

		test('should be visible on show()', function() {
			var $fixture = $('#qunit-fixture').append('<a href="" tooltip="abcd">boo</a>')
				,$tooltip = $.scojs_tooltip('#qunit-fixture a', {contentAttr: 'tooltip', appendTo: '#qunit-fixture'}).show();
			equal($('#qunit-fixture .tooltip').css('display'), 'block', 'tooltip is visible');
		});

		test('should be hidden on hide()', function() {
			var $fixture = $('#qunit-fixture').append('<a href="" tooltip="abcd">boo</a>')
				,$tooltip = $.scojs_tooltip('#qunit-fixture a', {contentAttr: 'tooltip', appendTo: '#qunit-fixture'}).show();
			equal($('#qunit-fixture .tooltip').css('display'), 'block', 'tooltip is visible after show');
			$tooltip.hide();
			ok(!$('#qunit-fixture .tooltip').is(':visible'), 'tooltip is invisible after hide');
		});


	module('tooltip data-api');

		test('should appear on mouseenter', function() {
			var $fixture = $('#qunit-fixture').append('<a href="" data-trigger="tooltip" data-content="abcd" data-append-to="#qunit-fixture">boo</a>');
			equal($('#qunit-fixture .tooltip').length, 0, 'tooltip is invisible initially');
			$fixture.find('a').trigger('mouseenter');
			equal($('#qunit-fixture .tooltip').css('display'), 'block', 'tooltip is visible on hover');
		});

		test('should disappear on mouseleave', function() {
			var $fixture = $('#qunit-fixture').append('<a href="" data-trigger="tooltip" data-content="abcd" data-delay="1000" data-append-to="#qunit-fixture">boo</a>');
			$fixture.find('a').trigger('mouseenter').trigger('mouseleave');
			equal($('#qunit-fixture .tooltip').css('display'), 'block', 'tooltip is visible immediately after mouse leave');
			stop();
			setTimeout(function() {
				ok(!$('#qunit-fixture .tooltip').is(':visible'), 'tooltip is invisible 1 second after mouse leave');
				start();
			}, 1000);
		});

		test('should be hoverable', function() {
			var $fixture = $('#qunit-fixture').append('<a href="" data-trigger="tooltip" data-content="abcd" data-append-to="#qunit-fixture">boo</a>');
			$fixture.find('a').trigger('mouseenter').trigger('mouseleave');
			$fixture.find('.tooltip').trigger('mouseenter');
			stop();
			setTimeout(function() {
				equal($('#qunit-fixture .tooltip').css('display'), 'block', 'tooltip is visible');
				$fixture.find('.tooltip').trigger('mouseleave');
				setTimeout(function() {
					ok(!$('#qunit-fixture .tooltip').is(':visible'), 'tooltip is invisible');
					start();
				}, 500);
			}, 1000);
		});
});
