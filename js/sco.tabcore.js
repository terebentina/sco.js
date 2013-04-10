;(function($, undefined) {
	"use strict";

	function TabCore($wrapper, options) {
		var defaults = {
				 active: 0
				,easing: ''
			}
			,self = this
			;

		this.options = $.extend({}, defaults, options);
		var transitionEnd = ($.support.transition && this.options.easing) ? $.support.transition.end : null
		this.$tab_wrapper = $wrapper;
		if (this.options.easing) {
			this.$tab_wrapper.addClass(this.options.easing);
		}

		this.$tab_wrapper.on('select', function(e, options, index) {
			var  direction = 'left'
				,type = 'next'
				;
			if (options.active > index) {
				direction = 'right';
				type = 'prev';
			}

			function onEnd(e) {
				self.$tabs.eq(options.active).removeClass('active ' + direction);
				self.options.active = index;
				self.$tabs.eq(index).removeClass([type, direction].join(' ')).addClass('active');
			}

			if (transitionEnd) {
				self.$tab_wrapper.one(transitionEnd, onEnd);
			}
			self.$tabs.eq(index).addClass(type)[0].offsetWidth; // force reflow
			self.$tabs.eq(options.active).addClass(direction);
			self.$tabs.eq(index).addClass(direction);
			if (!transitionEnd) {
				onEnd();
			}
		});

		this.$tabs = this.$tab_wrapper.children();

		if (typeof this.options.onInit === 'function') {
			this.options.onInit.call(this);
		}

		this.$tabs.eq(this.options.active).addClass('active');
	}

	$.extend(TabCore.prototype, {
		select: function(index) {
			if (index !== this.options.active) {
				if (typeof this.options.onBeforeSelect == 'function' && this.options.onBeforeSelect.call(self, index) === false) {
					return;
				}
				this.$tab_wrapper.trigger('select', [this.options, index]);
			}
		}

		,next: function() {
			var  tab_count = this.$tabs.length
				,next
				;
			if (this.options.active === tab_count - 1) {
				next = 0;
			} else {
				next = this.options.active + 1;
			}
			this.select(next);
		}

		,prev: function() {
			var prev;
			if (this.options.active === 0) {
				prev = this.$tabs.length - 1;
			} else {
				prev = this.options.active - 1;
			}
			this.select(prev);
		}
	});

	$.scojs_tabcore = function(elem, options) {
		if (typeof elem === 'string') {
			elem = $(elem);
		}
		return new TabCore(elem, options);
	};
})(jQuery);
