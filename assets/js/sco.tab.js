/* ==========================================================
 * sco.tab.js
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

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, devel:true */

;(function($, undefined) {
	"use strict";

	var pluginName = 'scojs_tab';

	function Tab($tab_headers, options) {
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$tab_headers = $tab_headers;

		if (this.options.content === undefined) {
			return;
		}

		this.panes = $.scojs_panes(this.options.content, this.options);

		var self = this
			,auto_click = false
			;
		this.$tab_headers.on('click.' + pluginName, 'a', function(e) {
			var  $this = $(this)
				,$my_li = $this.closest('li')
				,my_index = $my_li.index()
				;

			if (!$.address || $this.attr('href') == '#') {
				e.preventDefault();
			}

			self.$tab_headers.find('li.active').removeClass('active');
			$my_li.addClass('active');

			self.panes.select(my_index);
		});

		if ($.address) {
			$.address.externalChange(function(e) {
				var hash = '#' + e.value.slice(1);
				self.$tab_headers.find('a').each(function() {
					var $this = $(this);
					if ($this.attr('href') === hash) {
						auto_click = true;
						$this.trigger('click');
						return false;
					}
				});
			}).history(true);
		}

		if (!auto_click) {
			this.$tab_headers.find('li:eq(' + this.options.active + ') a').trigger('click');
		}
	}

	$.extend(Tab.prototype, {
		select: function(index) {
			this.panes.select(index);
		}

		,next: function() {
			this.panes.next();
		}

		,prev: function() {
			this.panes.prev();
		}
	});


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var $this = $(this)
					,data = $this.data()
					,opts = $.extend({}, $.fn[pluginName].defaults, options, data)
					;
				obj = new Tab($this, opts);
				$.data(this, pluginName, obj);
			}
		});
	};


	$[pluginName] = function(elem, options) {
		if (typeof elem === 'string') {
			elem = $(elem);
		}
		return new Tab(elem, options);
	};


	$.fn[pluginName].defaults = {
		active: 0
		,easing: ''
	};

	$(function() {
		$('[data-trigger="tab"]')[pluginName]();
	});
})(jQuery);
