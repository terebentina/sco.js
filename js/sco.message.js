/* ==========================================================
 * sco.message.js
 * http://github.com/terebentina/sco.js
 * ==========================================================
 * Copyright 2012 Dan Caragea.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

/*jshint laxcomma:true, sub:true, browser:true, jquery:true */
/*global define:true */

(function(factory) {
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
