/* ==========================================================
 * sco.placeholder.js
 * http://github.com/terebentina/sco.js
 * ==========================================================
 * Copyright 2013 Dan Caragea.
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

	if (!('placeholder' in document.createElement("input"))) {
		$(function() {
			$('input[type=text][placeholder], textarea[placeholder]').each(function() {
				var $el = $(this)
					,msg = $el.attr('placeholder')
					,origColor = $el.css('color');

				$el.on('focus.sco', function() {
					if ($el.val() === msg) {
						$el.val('').css('color', origColor);
					}
				}).on('blur.sco', function() {
					if (!$el.val()) {
						$el.val(msg).css('color', '#777');
					}
				}).trigger('blur.sco');
			});
		});
	}
}));
