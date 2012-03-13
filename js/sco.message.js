(function (factory) {
	"use strict";

    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function($) {
	"use strict";

	$.scomessage = function(message, type) {
		clearTimeout($.scomessage.timeout);
		var $selector = $('#' + $.scomessage.defaults.id);
		if (!$selector.length) {
			$selector = $('<div/>', {id: $.scomessage.defaults.id}).prependTo('body');
		}
		$selector.html(message);
		if (typeof type == 'undefined' || type == $.scomessage.TYPE_ERROR) {
			$selector.removeClass($.scomessage.defaults.ok_class).addClass($.scomessage.defaults.err_class);
		} else if (type == $.scomessage.TYPE_OK) {
			$selector.removeClass($.scomessage.defaults.err_class).addClass($.scomessage.defaults.ok_class);
		}
		$selector.slideDown(function() {
			$.scomessage.timeout = setTimeout(function() { $selector.slideUp(); }, $.scomessage.defaults.delay);
		});
	};


	$.extend($.scomessage, {
		defaults: {
			id: 'page_message',
			ok_class: 'page_mess_ok',
			err_class: 'page_mess_error',
			delay: 4000
		},

		TYPE_ERROR: 1,
		TYPE_OK: 2
	});
}));
