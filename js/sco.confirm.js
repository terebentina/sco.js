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

;(function($, undefined) {
	"use strict";

	var pluginName = 'scojs_confirm';

	function Confirm(options) {
		var self = this;

		var init = function() {
			self.options = $.extend({}, $.fn[pluginName].defaults, options);

			var $modal = $(self.options.target);
			if (!$modal.length) {
				$modal = $('<div class="modal" id="' + self.options.target.substr(1) + '"><div class="modal-body inner"/><div class="modal-footer"><a class="btn cancel" href="#" data-dismiss="modal">cancel</a> <a href="#" class="btn btn-danger" data-action="1">yes</a></div></div>').appendTo(self.options.appendTo).hide();
				if (typeof self.options.action == 'function') {
					$modal.find('[data-action]').attr('href', '#').on('click.' + pluginName, function(e) {
						e.preventDefault();
						self.options.action.call(self);
						self.close();
					});
				} else if (typeof self.options.action == 'string') {
					$modal.find('[data-action]').attr('href', self.options.action);
				}
			}
			self.scomodal = $.scojs_modal(self.options);
		};

		init();
	}

	Confirm.prototype = $.extend(Confirm.prototype, {
		show: function() {
			this.scomodal.show();
		}

		,close: function() {
			this.scomodal.close();
		}
	});


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var $this = $(this)
					,data = $this.data()
					,title = $this.attr('title') || data.title
					;
				options = $.extend({}, $.fn[pluginName].defaults, options, data);
				if (!title) {
					title = 'this';
				}
				options.content = options.content.replace(':title', title);
				if (!options.action) {
					options.action = $this.attr('href');
				} else if (typeof window[options.action] == 'function') {
					options.action = window[options.action];
				}
				obj = new Confirm(options);
				$.data(this, pluginName, obj);
			}
			obj.show();
		});
	};

	$[pluginName] = function(options) {
		return new Confirm(options);
	};

	$.fn[pluginName].defaults = {
		content: 'Are you sure you want to delete :title?'
		,cssclass: 'confirm_modal'
		,target: '#confirm_modal'	// this must be an id. This is a limitation for now, @todo should be fixed
		,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
	};

	$(document).on('click.' + pluginName, '[data-trigger="confirm"]', function(e) {
		$(this)[pluginName]();
		return false;
	});
})(jQuery);
