/* ==========================================================
 * sco.confirm.js
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

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, devel:true */
/*global define:true, _:true */

(function(factory) {
	"use strict";

    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
			'sco.modal.js'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function($) {
	"use strict";

	$.fn.sconfirm = function(options) {
		return this.each(function() {
			var $this = $(this)
				,data = $this.data()
				,title = $this.attr('title');

			data = $.extend({}, $.fn.sconfirm.defaults, data, options);
			if (!title) {
				title = 'this';
			}
			data.content = data.content.replace(':title', title);
			var $modal = $(data.target);
			if (!$modal.length) {
				$modal = $('<div class="modal" id="'+data.target.substr(1)+'"><div class="modal-body inner"/><div class="modal-footer"><a href="#" class="btn btn-danger" data-action="1">yes</a> <a class="btn" href="#" data-dismiss="modal">cancel</a></div></div>').appendTo('body');
				if (data.onaction) {
					$modal.find('[data-action]').on('click.sconfirm', function(e) {
						e.preventDefault();
						window[data.onaction]();
					});
				} else {
					$modal.find('[data-action]').attr('href', $this.attr('href'));
				}
			}

			$.scomodal(data);
		});
	};

	$.fn.sconfirm.defaults = {
		content: 'Are you sure you want to delete :title?'
		,cssclass: 'confirm_modal'
		,target: '#confirm_modal'	// this must be an id. This is a limitation for now, @todo should be fixed
	};

	$(document).on('click.sconfirm', '[data-trigger="confirm"]', function(e) {
		$(this).sconfirm();
		return false;
	});
}));
