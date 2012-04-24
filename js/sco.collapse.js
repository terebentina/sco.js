/* ==========================================================
 * sco.collapse.js
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
/*global define:true, Spinner:true */

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

	function Collapse($trigger, options) {
		this.options = $.extend({}, $.fn.scollapse.defaults, options);
		this.$trigger = $trigger;
		this.$target = $(this.options.target);
		if (this.options.parent !== null) {
			this.$parent = $(this.options.parent);
		}
	}

	$.extend(Collapse.prototype, {
		toggle: function() {
			var self = this;
			self.$trigger.toggleClass(self.options.activeTriggerClass);
			if (self.options.triggerHtml !== null) {
				self.$trigger.html(function() {
					if (self.$trigger.hasClass(self.options.activeTriggerClass)) {
						return self.options.triggerHtml.on;
					} else {
						return self.options.triggerHtml.off;
					}
				});
			}

			self.$target.toggleClass(self.options.activeTargetClass);
			if (self.$parent && self.$trigger.hasClass(self.options.activeTriggerClass)) {
console.log('da', self.$parent, self.$parent.find('.collapse.' + self.options.activeTargetClass));
				self.$parent.find('.collapse.' + self.options.activeTargetClass).not(self.$target).removeClass(self.options.activeTargetClass);
			}
		}
	});

	$.fn.scollapse = function(opts) {
		return this.each(function() {
			var $this = $(this)
				,data = $this.data()
				,options = $.extend({}, data, opts)
				;
			delete options.scollapse;
			if (!data.scollapse) {
				$this.data('scollapse', (data.scollapse = new Collapse($this, options)));
			}
			data.scollapse.toggle();
		});
	};

	$.fn.scollapse.defaults = {
		parent: null						// having a parent activates the accordion mode behaviour
		,target: '.collapse'				// the element to show/hide
		,activeTriggerClass: 'active'		// class to add to the trigger in active (on) state
		,activeTargetClass: 'in'			// class to add to the target in active (on) state
		,triggerHtml: null					// if not null, this should be a hash like {off: 'more', on: 'less'}. This text is set on the trigger.
	};

	$(document).on('click.sco', '[data-trigger="collapse"]', function(e) {
		var $this = $(this).scollapse();
		if ($this.is('a')) {
			return false;
		}
	});
}));
