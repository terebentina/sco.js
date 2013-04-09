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

		this.tabcore = $.scojs_tabcore(this.options.content, this.options);

		var self = this;
		this.$tab_headers.on('click.' + pluginName, 'a', function(e) {
			var  $this = $(this)
				,$my_li = $this.closest('li')
				,my_index = $my_li.index()
				;

			if (!$.address) {
				e.preventDefault();
			}

			self.$tab_headers.find('li.active').removeClass('active');
			$my_li.addClass('active');

			self.tabcore.select(my_index);
		});

		if ($.address) {
			$.address.externalChange(function(e) {
				var hash = '#' + e.value.slice(1);
				this.$tab_headers.find('a').each(function(i) {
					if ($(this).attr('href') === hash) {
						self.tabcore.select(i);
						return false;
					}
				});
			}).history(true);
		}
	}

	$.fn[pluginName] = function(options) {
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var $this = $(this)
					,data = $this.data()
					;
				options = $.extend({}, $.fn[pluginName].defaults, options, data);
				obj = new Tab($this, options);
				$.data(this, pluginName, obj);
			}
		});
	};

	$.fn[pluginName].defaults = {
		active: 0
		,easing: ''
	};

	$(function() {
		$('[data-trigger="tab"]')[pluginName]();
	});
})(jQuery);
