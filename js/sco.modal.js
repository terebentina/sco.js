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
 * http://apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, devel:true, eqeqeq:false */
/*global define:true, Spinner:true */

;(function($, undefined) {
	"use strict";

	var pluginName = 'scojs_modal';

	function Modal(options) {
		var self = this;

		var init = function() {
			self.options = $.extend({}, $.fn.scojs_modal.defaults, options);
			self.$modal = $(self.options.target).attr('class', 'modal fade').hide();
			self.$backdrop = $('.modal-backdrop');

			var $content_wrapper
				,title
				;

			if (!self.$modal.length) {
				self.$modal = $('<div class="modal fade" id="' + self.options.target.substr(1) + '"><div class="modal-header"><a class="close" href="#" data-dismiss="modal">×</a><h3>&nbsp;</h3></div><div class="inner"/></div>').appendTo(self.options.appendTo).hide();
			}
			title = self.options.title;
			if (title === '') {
				title = '&nbsp;';
			}
			self.$modal.find('.modal-header h3').html(title);

			if (self.options.cssclass !== undefined) {
				self.$modal.addClass(self.options.cssclass);
			}

			if (self.options.width !== undefined) {
				self.$modal.width(self.options.width);
			}

			if (self.options.left !== undefined) {
				self.$modal.css({'left': self.options.left});
			}

			if (self.options.height !== undefined) {
				self.$modal.height(self.options.height);
			}

			if (self.options.top !== undefined) {
				self.$modal.css({'top': self.options.top});
			}

			if (!self.$backdrop.length) {
				self.$backdrop = $('<div class="modal-backdrop fade" />').appendTo(self.options.appendTo);
				title = self.$backdrop[0].offsetWidth; // force reflow. "title = " is not needed but I added it just to avoid jshint warnings
				self.$backdrop.addClass('in');
			}

			self.$modal.off('close.' + pluginName).on('close.' + pluginName, function() {self.close.call(self)});

			if (self.options.remote !== undefined && self.options.remote != '' && self.options.remote !== '#') {
				var spinner;
				if (Spinner) {
					spinner = new Spinner({color: '#3d9bce'}).spin(self.$modal[0]);
				}
				self.$modal.find('.inner').load(self.options.remote, function() {
					if (spinner) {
						spinner.stop();
					}
					self.$modal.trigger('loaded');
				});
			} else {
				self.$modal.find('.inner').html(self.options.content);
				self.$modal.trigger('loaded');
			}
		}

		init();
	}


	Modal.prototype = $.extend(Modal.prototype, {
		show: function() {
			this.$modal.show().addClass('in');
		}

		,close: function() {
			this.$modal.hide().off('close.' + pluginName).find('.inner').html('');
			this.$backdrop.remove();
			if (typeof this.options.onClose === 'function') {
				this.options.onClose.call(this, this.options);
			}
		}

		,destroy: function() {
			this.$modal.remove();
			this.$backdrop.remove();
			this.$modal = null;
			this.$backdrop = null;
		}
	});


	$.fn.scojs_modal = function(options) {
		return this.each(function() {
			if (!$.data(this, pluginName)) {
				var $this = $(this)
					,data = $this.data()
					,mod
					;
				options = $.extend({}, options, data)
				if ($this.attr('href') !== '' && $this.attr('href') != '#') {
					options.remote = $this.attr('href');
				}
				$.data(this, pluginName, (mod = new Modal(options)));
				mod.show();
			}
		});
	};

	$.scojs_modal = function(options) {
		return new Modal(options);
	};

	$.fn.scojs_modal.defaults = {
		title: '&nbsp;'		// modal title
		,target: '#modal'	// the modal id. MUST be an id for now.
		,content: ''		// the static modal content (in case it's not loaded via ajax)
		,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
	};

	$(document).on('click.' + pluginName, '[data-trigger="modal"]', function() {
		$(this).scojs_modal();
		console.log('isa', $(this).is('a'));
		if ($(this).is('a')) {
			return false;
		}
	}).on('click.' + pluginName, '[data-dismiss="modal"]', function(e) {
		e.preventDefault();
		$(this).parents('.modal').trigger('close');
	});
})(jQuery);
