/* ==========================================================
 * sco.modal.js
 * http://github.com/terebentina/sco.js
 * ==========================================================
 * Copyright 2014 Dan Caragea.
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
/*global Spinner:true */

;(function($, undefined) {
	"use strict";

	var pluginName = 'scojs_modal';

	function Modal(options) {
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$modal = $(this.options.target).attr('class', 'modal fade').hide();
		var self = this;
		function init() {
			if (self.options.title === '') {
				self.options.title = '&nbsp;';
			}
		}

		init();
	}


	$.extend(Modal.prototype, {
		show: function() {
			var self = this
				,$backdrop;

			if (!this.options.noBackdrop) {
				$backdrop = $('.modal-backdrop');
			}
			if (!this.$modal.length) {
				this.$modal = $('<div class="modal fade" id="' + this.options.target.substr(1) + '" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">&nbsp;</h4></div><div class="inner"/></div></div></div>').appendTo(this.options.appendTo).hide();
			}

			this.$modal.find('.modal-header h4').html(this.options.title);

			if (this.options.cssClass !== undefined) {
				this.$modal.attr('class', 'modal fade ' + this.options.cssClass);
			}

			if (this.options.keyboard) {
				this.escape();
			}

			// a certain dimension has been asked for. Check if it's larger than the screen and adjust accordingly
			if (this.options.width && this.options.height) {
				var windowDims = [$(window).width(), $(window).height()]
					,dims = [this.options.width, this.options.height]
					,tmp
					;
				if (dims[0] > windowDims[0]) {
					tmp = dims[0];
					dims[0] = windowDims[0];
					dims[1] = dims[1] * (dims[0] / tmp);
				}
				if (dims[1] > windowDims[1] - 100) {
					tmp = dims[1];
					dims[1] = windowDims[1] - 100;
					dims[0] = dims[0] * (dims[1] / tmp);
				}

				this.$modal.find('.modal-dialog').css({width: dims[0], height: dims[1]});
			} else {
				this.$modal.find('.modal-dialog').css({width: '', height: ''});
			}

			if (!this.options.noBackdrop) {
				if (!$backdrop.length) {
					$backdrop = $('<div class="modal-backdrop fade" />').appendTo(this.options.appendTo);
				}
				$backdrop[0].offsetWidth; // force reflow
				$backdrop.addClass('in');
			}

			this.$modal.off('close.' + pluginName).on('close.' + pluginName, function() {
				self.close.call(self);
			});
			if (this.options.isImage && this.options.remote !== undefined) {
				this.options.content = '<img class="remote" src="' + this.options.remote + '">';
				delete this.options.remote;
			}
			if (this.options.remote !== undefined && this.options.remote != '' && this.options.remote !== '#') {
				var spinner;
				if (typeof Spinner == 'function') {
					spinner = new Spinner({color: '#3d9bce'}).spin(this.$modal[0]);
				}
				this.$modal.find('.inner').load(this.options.remote, function() {
					if (spinner) {
						spinner.stop();
					}
					if (self.options.cache) {
						self.options.content = $(this).html();
						delete self.options.remote;
					}
				});
			} else {
				this.$modal.find('.inner').html(this.options.content);
			}

			$('body').addClass('modal-open');
			this.$modal.show().addClass('in');
			return this;
		}

		,close: function() {
			this.$modal.hide().off('.' + pluginName).find('.inner').html('');
			if (this.options.cssclass !== undefined) {
				this.$modal.removeClass(this.options.cssclass);
			}
			$(document).off('keyup.' + pluginName);
			$('.modal-backdrop').remove();
			$('body').removeClass('modal-open');
			if (typeof this.options.onClose === 'function') {
				this.options.onClose.call(this, this.options);
			}
			return this;
		}

		,destroy: function() {
			this.$modal.remove();
			$(document).off('keyup.' + pluginName);
			$('.modal-backdrop').remove();
			this.$modal = null;
			return this;
		}

		,escape: function() {
			var self = this;
			$(document).on('keyup.' + pluginName, function(e) {
				if (e.which == 27) {
					self.close();
				}
			});
		}
	});


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var  $this = $(this)
					,data = $this.data()
					,opts = $.extend({}, options, data)
					;
				if ($this.attr('href') !== '' && $this.attr('href') != '#') {
					opts.remote = $this.attr('href');
				}
				obj = new Modal(opts);
				$.data(this, pluginName, obj);
			}
			obj.show();
		});
	};


	$[pluginName] = function(options) {
		return new Modal(options);
	};


	$.fn[pluginName].defaults = {
		title: '&nbsp;'		// modal title
		,target: '#modal'	// the modal id. MUST be an id for now.
		,content: ''		// the static modal content (in case it's not loaded via ajax)
		,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
		,cache: false		// should we cache the output of the ajax calls so that next time they're shown from cache?
		,keyboard: false
		,noBackdrop: false
		,isImage: false		// if this is true then the remote url points to an image so we should wrap the url in an <img src="remote"> tag
	};


	$(document).on('click.' + pluginName, '[data-trigger="modal"]', function() {
		$(this)[pluginName]();
		return !$(this).is('a');
	}).on('click.' + pluginName, '[data-dismiss="modal"]', function(e) {
		e.preventDefault();
		$(this).closest('.modal').trigger('close');
	});
})(jQuery);
