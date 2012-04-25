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
		if (this.options.target !== null) {
			this.$target = $(this.options.target);
		} else {
			this.$target = this.$trigger[this.options.mode](this.options.collapseSelector);
		}
		if (this.options.parent !== null) {
			this.$parent = this.$trigger.parents(this.options.parent);
		}
	}

	$.extend(Collapse.prototype, {
		toggle: function() {
			var self = this;

			//self.$target.toggleClass(self.options.activeTargetClass);
			self.$target[$.camelCase(self.options.ease + '-toggle')]();
			if (self.$parent && !self.$trigger.hasClass(self.options.activeTriggerClass)) {
				self.$parent.find(self.options.triggerSelector + '.' + self.options.activeTriggerClass).scollapse();
			}
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
		}
	});

	$.fn.scollapse = function(opts) {
		return this.each(function() {
			var $this = $(this)
				,data = $this.data()
				,options = $.extend({}, $.fn.scollapse.defaults, data, opts)
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
		,target: null						// the element to show/hide. If null, the target is chosen based on the "mode" selector
		,activeTriggerClass: 'active'		// class to add to the trigger in active (on) state
		//,activeTargetClass: 'in'			// class to add to the target in active (on) state
		,triggerHtml: null					// if not null, this should be a hash like {off: 'more', on: 'less'}. This text is set on the trigger.
		,mode: 'next'						// "next" means target is after trigger, "prev" means target is before trigger
		,collapseSelector: '.collapse'		// used in accordion to find out what to collapse when the current target expands or if the target is null
		,triggerSelector: '[data-trigger="collapse"]'		// used in accordion to find out all triggers
		,ease: 'slide'						// the animation effect to use. Must support toggle (like slideToggle/fadeToggle or even empty string :))
	};

	$(document).on('click.scollapse', '[data-trigger="collapse"]', function(e) {
		$(this).scollapse({triggerSelector: e.handleObj.selector});
		if ($(this).is('a')) {
			return false;
		}
	});
}));
