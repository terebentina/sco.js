/* ==========================================================
 * sco.modal.js
 * http://github.com/terebentina/sco.js
 * ==========================================================
 * Copyright 2012 Dan Caragea.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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

	var Sco = Sco || {};

	Sco.popup = function(data) {
		var $target = $(data.target).attr('class', 'modal fade in')
			,$backdrop = $('.modal-backdrop');

		$target.find('.modal-header h3').html(data.title);

		if (typeof data.css !== 'undefined') {
			$target.addClass(data.css);
		}

		if (typeof data.width !== 'undefined') {
			$target.width(data.width);
		}

		if (typeof data.left !== 'undefined') {
			$target.css({'left': data.left});
		}

		if (typeof data.height !== 'undefined') {
			$target.height(data.height);
		}

		if (typeof data.top !== 'undefined') {
			$target.css({'top': data.top});
		}

		if (!$backdrop.length) {
			$backdrop = $('<div class="modal-backdrop fade" />').appendTo(document.body);
			$backdrop[0].offsetWidth; // force reflow
			$backdrop.addClass('in');
		}

		$target.show();
		if (typeof data.href !== 'undefined') {
			$target.find('.modal_loading').show();

			$('.inner', $target).load(data.href, function() {
				$('.modal_loading', $target).hide();
			});
		}
	};

	$(document).on('click.scomodal', '[data-trigger="modal"]', function(e) {
		e.preventDefault();
		var $me = $(e.currentTarget)
			,data = $me.data()
			,defaults = {
				title: '&nbsp;'
				,target: '#modal'
			};

		data.href = $me.prop('href');
		data = $.extend({}, defaults, data);
		Sco.popup(data);
	});

	$('.modal').live('close', function() {
		$(this).hide().find('.inner').html('');
		$('.modal-backdrop').remove();
	}).find('[data-dismiss="modal"]').live('click', function(e) {
		e.preventDefault();
		$(this).parents('.modal').trigger('close');
	});
}));
