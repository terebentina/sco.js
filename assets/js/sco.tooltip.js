/* ==========================================================
 * sco.tooltip.js
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

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, smarttabs:true, eqeqeq:false */

;(function($, undefined) {
	"use strict";

	var pluginName = 'scojs_tooltip';

	function Tooltip($trigger, options) {
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$tooltip = null;
		this.$trigger = this.$target = $trigger;
		this.leave_timeout = null;
		this.options.trigger_title = null;
		var self = this;

		function init() {
			self.$tooltip = $('<div class="tooltip"><span></span><div class="pointer"></div></div>').appendTo(self.options.appendTo).hide();
			if (self.options.contentElem !== undefined && self.options.contentElem !== null) {
				self.options.content = $(self.options.contentElem).html();
			} else if (self.options.contentAttr !== undefined && self.options.contentAttr !== null) {
				self.options.content = self.$trigger.attr(self.options.contentAttr);
				if (self.options.contentAttr == 'title') {
					self.options.trigger_title = self.options.content;
				}
			}
			self.$tooltip.find('span').html(self.options.content);
			if (self.options.cssclass != '') {
				self.$tooltip.addClass(self.options.cssclass);
			}
			if (self.options.target !== undefined) {
				self.$target = $(self.options.target);
			}
			if (self.options.hoverable) {
				self.$tooltip.on('mouseenter.' + pluginName, $.proxy(self.do_mouseenter, self))
							 .on('mouseleave.' + pluginName, $.proxy(self.do_mouseleave, self))
							 .on('close.' + pluginName, $.proxy(self.hide, self));
			}
		};

		init();
	}


	$.extend(Tooltip.prototype, {
		show: function(allow_mirror) {
			if (allow_mirror === undefined) {
				allow_mirror = true;
			}
			this.$tooltip.removeClass('pos_w pos_e pos_n pos_s pos_nw pos_ne pos_se pos_sw pos_center').addClass('pos_' + this.options.position);
			var  target_box = this.$target.offset()
				,tooltip_box = {left: 0, top: 0, width: Math.floor(this.$tooltip.outerWidth()), height: Math.floor(this.$tooltip.outerHeight())}
				,pointer_box = {left: 0, top: 0, width: Math.floor(this.$tooltip.find('.pointer').outerWidth()), height: Math.floor(this.$tooltip.find('.pointer').outerHeight())}
				,doc_box = {left: $(document).scrollLeft(), top: $(document).scrollTop(), width: $(window).width(), height: $(window).height()}
				;
			target_box.left = Math.floor(target_box.left);
			target_box.top = Math.floor(target_box.top);
			target_box.width = Math.floor(this.$target.outerWidth());
			target_box.height = Math.floor(this.$target.outerHeight());

			if (this.options.position === 'w') {
				tooltip_box.left = target_box.left - tooltip_box.width - pointer_box.width;
				tooltip_box.top = target_box.top + Math.floor((target_box.height - tooltip_box.height) / 2);
				pointer_box.left = tooltip_box.width;
				pointer_box.top = Math.floor(target_box.height / 2);
			} else if (this.options.position === 'e') {
				tooltip_box.left = target_box.left + target_box.width + pointer_box.width;
				tooltip_box.top = target_box.top + Math.floor((target_box.height - tooltip_box.height) / 2);
				pointer_box.left = -pointer_box.width;
				pointer_box.top = Math.floor(tooltip_box.height / 2);
			} else if (this.options.position === 'n') {
				tooltip_box.left = target_box.left - Math.floor((tooltip_box.width - target_box.width) / 2);
				tooltip_box.top = target_box.top - tooltip_box.height - pointer_box.height;
				pointer_box.left = Math.floor(tooltip_box.width / 2);
				pointer_box.top = tooltip_box.height;
			} else if (this.options.position === 's') {
				tooltip_box.left = target_box.left - Math.floor((tooltip_box.width - target_box.width) / 2);
				tooltip_box.top = target_box.top + target_box.height + pointer_box.height;
				pointer_box.left = Math.floor(tooltip_box.width / 2);
				pointer_box.top = -pointer_box.height;
			} else if (this.options.position === 'nw') {
				tooltip_box.left = target_box.left - tooltip_box.width + pointer_box.width;	// +pointer_box.width because pointer is under
				tooltip_box.top = target_box.top - tooltip_box.height - pointer_box.height;
				pointer_box.left = tooltip_box.width - pointer_box.width;
				pointer_box.top = tooltip_box.height;
			} else if (this.options.position === 'ne') {
				tooltip_box.left = target_box.left + target_box.width - pointer_box.width;
				tooltip_box.top = target_box.top - tooltip_box.height - pointer_box.height;
				pointer_box.left = 1;
				pointer_box.top = tooltip_box.height;
			} else if (this.options.position === 'se') {
				tooltip_box.left = target_box.left + target_box.width - pointer_box.width;
				tooltip_box.top = target_box.top + target_box.height + pointer_box.height;
				pointer_box.left = 1;
				pointer_box.top = -pointer_box.height;
			} else if (this.options.position === 'sw') {
				tooltip_box.left = target_box.left - tooltip_box.width + pointer_box.width;
				tooltip_box.top = target_box.top + target_box.height + pointer_box.height;
				pointer_box.left = tooltip_box.width - pointer_box.width;
				pointer_box.top = -pointer_box.height;
			} else if (this.options.position === 'center') {
				tooltip_box.left = target_box.left + Math.floor((target_box.width - tooltip_box.width) / 2);
				tooltip_box.top = target_box.top + Math.floor((target_box.height - tooltip_box.height) / 2);
				allow_mirror = false;
				this.$tooltip.find('.pointer').hide();
			}

			// if the tooltip is out of bounds we first mirror its position
			if (allow_mirror) {
				var  newpos = this.options.position
					,do_mirror = false;
				if (tooltip_box.left < doc_box.left) {
					newpos = newpos.replace('w', 'e');
					do_mirror = true;
				} else if (tooltip_box.left + tooltip_box.width > doc_box.left + doc_box.width) {
					newpos = newpos.replace('e', 'w');
					do_mirror = true;
				}
				if (tooltip_box.top < doc_box.top) {
					newpos = newpos.replace('n', 's');
					do_mirror = true;
				} else if (tooltip_box.top + tooltip_box.height > doc_box.top + doc_box.height) {
					newpos = newpos.replace('s', 'n');
					do_mirror = true;
				}
				if (do_mirror) {
					this.options.position = newpos;
					this.show(false);
					return;
				}
			}

			// if we're here, it's definitely after the mirroring or the position is center
			// this part is for slightly moving the tooltip if it's still out of bounds
			var pointer_left = null,
				pointer_top = null;
			if (tooltip_box.left < doc_box.left) {
				pointer_left = tooltip_box.left - doc_box.left - pointer_box.width / 2;
				tooltip_box.left = doc_box.left;
			} else if (tooltip_box.left + tooltip_box.width > doc_box.left + doc_box.width) {
				pointer_left = tooltip_box.left - doc_box.left - doc_box.width + tooltip_box.width - pointer_box.width / 2;
				tooltip_box.left = doc_box.left + doc_box.width - tooltip_box.width;
			}
			if (tooltip_box.top < doc_box.top) {
				pointer_top = tooltip_box.top - doc_box.top - pointer_box.height / 2;
				tooltip_box.top = doc_box.top;
			} else if (tooltip_box.top + tooltip_box.height > doc_box.top + doc_box.height) {
				pointer_top = tooltip_box.top - doc_box.top - doc_box.height + tooltip_box.height - pointer_box.height / 2;
				tooltip_box.top = doc_box.top + doc_box.height - tooltip_box.height;
			}

			this.$tooltip.css({left: tooltip_box.left, top: tooltip_box.top});
			if (pointer_left !== null) {
				this.$tooltip.find('.pointer').css('margin-left', pointer_left);
			}
			if (pointer_top !== null) {
				this.$tooltip.find('.pointer').css('margin-top', '+=' + pointer_top);
			}

			if (this.options.trigger_title) {
				this.$trigger.attr('title', '');
			}
			this.$tooltip.show();
		}

		,hide: function() {
			if (this.options.trigger_title) {
				this.$trigger.attr('title', this.options.trigger_title);
			}
			if (typeof this.options.on_close == 'function') {
				this.options.on_close.call(this);
			}
			this.$tooltip.hide();
		}

		,do_mouseenter: function() {
			if (this.leave_timeout !== null) {
				clearTimeout(this.leave_timeout);
				this.leave_timeout = null;
			}
			this.show();
		}

		,do_mouseleave: function() {
			var self = this;
			if (this.leave_timeout !== null) {
				clearTimeout(this.leave_timeout);
				this.leave_timeout = null;
			}
			if (this.options.autoclose) {
				this.leave_timeout = setTimeout(function() {
					clearTimeout(self.leave_timeout);
					self.leave_timeout = null;
					self.hide();
				}, this.options.delay);
			}
		}
	});

	$.fn[pluginName] = function(options) {
		var method = null
			,first_run = false
			;
		if (typeof options == 'string') {
			method = options;
		}
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var  $this = $(this)
					,data = $this.data()
					;
				first_run = true;
				if (typeof options === 'object') {
					options = $.extend({}, options, data);
				} else {
					options = data;
				}
				obj = new Tooltip($this, options);
				$.data(this, pluginName, obj);
			}
			if (method) {
				obj[method]();
			} else if (first_run) {
				$(this).on('mouseenter.' + pluginName, function() {
					obj.do_mouseenter();
				}).on('mouseleave.' + pluginName, function() {
					obj.do_mouseleave();
				});
			} else {
				obj.show();
			}
		});
	};


	$[pluginName] = function(elem, options) {
		if (typeof elem === 'string') {
			elem = $(elem);
		}
		return new Tooltip(elem, options);
	};


	$.fn[pluginName].defaults = {
		 contentElem: null
		,contentAttr: null
		,content: ''
		,hoverable: true		// should mouse over tooltip hold the tooltip or not?
		,delay: 200
		,cssclass: ''
		,position: 'n'			// n,s,e,w,ne,nw,se,sw,center
		,autoclose: true
		,appendTo: 'body'	// where should the tooltips be appended to (default to document.body). Added for unit tests, not really needed in real life.
	};

	$(document).on('mouseenter.' + pluginName, '[data-trigger="tooltip"]', function() {
		$(this)[pluginName]('do_mouseenter');
	}).on('mouseleave.' + pluginName, '[data-trigger="tooltip"]', function() {
		$(this)[pluginName]('do_mouseleave');
	});
	$(document).off('click.' + pluginName, '[data-dismiss="tooltip"]').on('click.' + pluginName, '[data-dismiss="tooltip"]', function(e) {
		$(this).parents('.tooltip').trigger('close');
	});
})(jQuery);
