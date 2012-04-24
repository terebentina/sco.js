/* ==========================================================
 * sco.tooltip.js
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

	function live_tooltip(e, options) {
		var self,
			$trigger;

		function on_mouseenter() {
			if (self.leave_timeout !== null) {
				clearTimeout(self.leave_timeout);
				self.leave_timeout = null;
			}
		}

		function on_mouse_leave(delay, force) {
			if (typeof delay === 'undefined') {
				delay = self.data.delay;
			}
			if (typeof force === 'undefined') {
				force = false;
			}
			if (self.leave_timeout !== null) {
				clearTimeout(self.leave_timeout);
				self.leave_timeout = null;
			}
			if (self.data.autoclose || force) {
				self.leave_timeout = setTimeout(function() {
					clearTimeout(self.leave_timeout);
					self.leave_timeout = null;
					self.on_close();
					self.$tooltip.remove();
					if (typeof $trigger !== 'undefined') {
						$trigger.removeData('scotip');
					}
				}, delay);
			}
		}

		function apply_data(data, mirror) {
			if (typeof mirror === 'undefined') {
				mirror = true;
			}
			for (var p in data) {
				if (data.hasOwnProperty(p)) {
					if (typeof $.fn.scotip.defaults[p] !== 'undefined') {
						if (p === 'content') {
							self.$tooltip.find('span').html(data[p]);
						} else if (p === 'cssclass' && data[p] !== '') {
							self.$tooltip.addClass(data[p]);
						} else if (p === 'position') {
							self.$tooltip.removeClass('pos_w pos_e pos_n pos_s pos_nw pos_ne pos_se pos_sw pos_center').addClass('pos_' + data[p]);
							var target_box = self.$target.offset(),
								tooltip_box = {left: 0, top: 0, width: Math.floor(self.$tooltip.outerWidth()), height: Math.floor(self.$tooltip.outerHeight())},
								pointer_box = {left: 0, top: 0, width: Math.floor(self.$tooltip.find('.pointer').outerWidth()), height: Math.floor(self.$tooltip.find('.pointer').outerHeight())},
								doc_box = {left: $(document).scrollLeft(), top: $(document).scrollTop(), width: $(window).width(), height: $(window).height()};
							target_box.left = Math.floor(target_box.left);
							target_box.top = Math.floor(target_box.top);
							target_box.width = Math.floor(self.$target.outerWidth());
							target_box.height = Math.floor(self.$target.outerHeight());
							if (data[p] === 'w') {
								tooltip_box.left = target_box.left - tooltip_box.width - pointer_box.width;
								tooltip_box.top = target_box.top + Math.floor((target_box.height - tooltip_box.height)/2);
								pointer_box.left = tooltip_box.width;
								pointer_box.top = Math.floor(target_box.height / 2);
							} else if (data[p] === 'e') {
								tooltip_box.left = target_box.left + target_box.width + pointer_box.width;
								tooltip_box.top = target_box.top + Math.floor((target_box.height - tooltip_box.height)/2);
								pointer_box.left = -pointer_box.width;
								pointer_box.top = Math.floor(tooltip_box.height / 2);
							} else if (data[p] === 'n') {
								tooltip_box.left = target_box.left - Math.floor((tooltip_box.width - target_box.width)/2);
								tooltip_box.top = target_box.top - tooltip_box.height - pointer_box.height;
								pointer_box.left = Math.floor(tooltip_box.width / 2);
								pointer_box.top = tooltip_box.height;
							} else if (data[p] === 's') {
								tooltip_box.left = target_box.left - Math.floor((tooltip_box.width - target_box.width)/2);
								tooltip_box.top = target_box.top + target_box.height + pointer_box.height;
								pointer_box.left = Math.floor(tooltip_box.width / 2);
								pointer_box.top = -pointer_box.height;
							} else if (data[p] === 'nw') {
								tooltip_box.left = target_box.left - tooltip_box.width + pointer_box.width;	// +pointer_box.width because pointer is under
								tooltip_box.top = target_box.top - tooltip_box.height - pointer_box.height;
								pointer_box.left = tooltip_box.width - pointer_box.width;
								pointer_box.top = tooltip_box.height;
							} else if (data[p] === 'ne') {
								tooltip_box.left = target_box.left + target_box.width - pointer_box.width;
								tooltip_box.top = target_box.top - tooltip_box.height - pointer_box.height;
								pointer_box.left = 1;
								pointer_box.top = tooltip_box.height;
							} else if (data[p] === 'se') {
								tooltip_box.left = target_box.left + target_box.width - pointer_box.width;
								tooltip_box.top = target_box.top + target_box.height + pointer_box.height;
								pointer_box.left = 1;
								pointer_box.top = -pointer_box.height;
							} else if (data[p] === 'sw') {
								tooltip_box.left = target_box.left - tooltip_box.width + pointer_box.width;
								tooltip_box.top = target_box.top + target_box.height + pointer_box.height;
								pointer_box.left = tooltip_box.width - pointer_box.width;
								pointer_box.top = -pointer_box.height;
							} else if (data[p] === 'center') {
								tooltip_box.left = target_box.left + Math.floor((target_box.width - tooltip_box.width)/2);
								tooltip_box.top = target_box.top + Math.floor((target_box.height - tooltip_box.height)/2);
								mirror = false;
								self.$tooltip.find('.pointer').hide();
							}

							// if the tooltip is out of bounds we first mirror its position
							if (mirror) {
								var newpos = data[p],
									do_mirror = false;
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
									apply_data({position: newpos}, false);
									return;
								}
							}

							// if we're here, it's definitely after the mirroring or the position is center
							// this part is for slightly moving the tooltip if it's still out of bounds
							var pointer_left = null,
								pointer_top = null;
							if (tooltip_box.left < doc_box.left) {
								pointer_left = tooltip_box.left - doc_box.left;
								tooltip_box.left = doc_box.left;
							} else if (tooltip_box.left + tooltip_box.width > doc_box.left + doc_box.width) {
								pointer_left = tooltip_box.left - doc_box.left - doc_box.width + tooltip_box.width;
								tooltip_box.left = doc_box.left + doc_box.width - tooltip_box.width;
							}
							if (tooltip_box.top < doc_box.top) {
								pointer_top = tooltip_box.top - doc_box.top;
								tooltip_box.top = doc_box.top;
							} else if (tooltip_box.top + tooltip_box.height > doc_box.top + doc_box.height) {
								pointer_top = tooltip_box.top - doc_box.top - doc_box.height + tooltip_box.height;
								tooltip_box.top = doc_box.top + doc_box.height - tooltip_box.height;
							}

							self.$tooltip.css({left: tooltip_box.left, top: tooltip_box.top}).show();
							if (pointer_left !== null) {
								self.$tooltip.find('.pointer').css('margin-left', '+=' + pointer_left);
							}
							if (pointer_top !== null) {
								self.$tooltip.find('.pointer').css('margin-top', '+=' + pointer_top);
							}
						}
					}
				}
			}
		}

		function build_tooltip(options) {
			self = {
				on_mouseenter: on_mouseenter,
				close: on_mouse_leave,
				on_close: function() {}
			};
			self.leave_timeout = null;
			if (typeof options.target !== 'undefined') {
				self.$target = $(options.target);
				delete options.target;
			} else {
				self.$target = $trigger;
			}
			if (typeof options.content_elem != 'undefined' && options.content_elem !== null) {
				options.content = $(options.content_elem).html();
				delete options.content_elem;
			}
			if (typeof options.content_attr != 'undefined' && options.content_attr !== null) {
				options.content = $trigger.attr(options.content_attr);
				delete options.content_attr;
			}
			self.$tooltip = $('<div class="tooltip"><span></span><div class="pointer"></div></div>').appendTo('body');
			self.data = $.extend(true, {}, $.fn.scotip.defaults, options);
			apply_data(self.data);
			self.$tooltip.bind('mouseenter', on_mouseenter)
						 .bind('mouseleave', function() {on_mouse_leave()});
		}

		if (e !== null) {
			$trigger = $(e.currentTarget);
			self = $trigger.data('scotip');
			options = e.data;
			if (e.type === 'mouseenter') {
				if (typeof self !== 'undefined') {
					on_mouseenter();
				} else {
					options = $.extend({}, options, $trigger.data());
					build_tooltip(options);
					$trigger.data('scotip', self);
				}
			} else if (e.type === 'mouseleave') {
				on_mouse_leave(self.data.delay);
			}
		} else {
			build_tooltip(options);
			self.close();
		}

		return self;
	}

	$.fn.scotip = function(opts) {
		$(document).delegate(this.selector, 'hover', opts, live_tooltip);
	};

	$.scotip = function(options) {
		return live_tooltip(null, options);
	};

	$.fn.scotip.defaults = {
		content_elem: null,
		content_attr: null,
		content: '',
		delay: 0,
		cssclass: '',
		// n,s,e,w,ne,nw,se,sw,center
		position: 'n',
		autoclose: true
	};
}));
