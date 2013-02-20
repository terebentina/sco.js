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

;(function($, undefined) {
	"use strict";

	var pluginName = 'scojs_message';

	$.scojs_message = function(message, type) {
		clearTimeout($.scojs_message.timeout);
		var $selector = $('#' + $.scojs_message.options.id);
		if (!$selector.length) {
			$selector = $('<div/>', {id: $.scojs_message.options.id}).appendTo($.scojs_message.options.appendTo);
		}
		$selector.html(message);
		if (type == undefined || type == $.scojs_message.TYPE_ERROR) {
			$selector.removeClass($.scojs_message.options.ok_class).addClass($.scojs_message.options.err_class);
		} else if (type == $.scojs_message.TYPE_OK) {
			$selector.removeClass($.scojs_message.options.err_class).addClass($.scojs_message.options.ok_class);
		}
		$selector.addClass('in');
		$.scojs_message.timeout = setTimeout(function() { $selector.removeClass('in'); }, $.scojs_message.options.delay);
	};


	$.extend($.scojs_message, {
		options: {
			id: 'page_message'
			,ok_class: 'page_mess_ok'
			,err_class: 'page_mess_error'
			,delay: 4000
			,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
		},

		TYPE_ERROR: 1,
		TYPE_OK: 2
	});
})(jQuery);
