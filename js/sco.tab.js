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

		if (typeof this.options.content === 'undefined') {
			return;
		}
		this.$content = $(this.options.content).children();

		if (typeof this.options.onInit === 'function') {
			this.options.onInit.call(this);
		}

		this.$tab_headers.on('click.' + pluginName, 'a', function(e) {
			var $this = $(this)
				,$my_li = $this.parents('li')
				,my_index = $my_li.index()
				,options = {active: my_index};

			if (!$.address) {
				e.preventDefault();
			}
			// @todo not working
			//if ($this.attr('href').indexOf('#') !== 0) {
			//	e.preventDefault();
			//	options.href = $this.attr('href');
			//}

			this.set(options);
		});

		this.set(this.options);

		if ($.address) {
			var self = this;
			$.address.externalChange(function(e) {
				var hash = '#' + e.value.slice(1);
				this.$tab_headers.find('a').each(function(i) {
					if ($(this).attr('href') === hash) {
						self.set({active: i});
						return false;
					}
				});
			}).history(true);
		}
	}

	$.extend(Tab.prototype, {
			get: function(key) {
				if (typeof self.options[key] !== 'undefined') {
					return self.options[key];
				}

				return undefined;
			},

			set: function(map) {
				var self = this;
				$.each(map, function(k, v) {
					if (k === 'active') {
						if (v !== self.get('active')) {
							if (typeof self.options.onBeforeSelect == 'function') {
								self.options.onBeforeSelect.call(self, v);
							}
							var $header_children = self.$tab_headers.children();
							// remove the .active class from all tab headers and add .active to selected tab header
							$header_children.removeClass('active').eq(v).addClass('active');
							// hide all tab content and show only the selected one
							self.$content.hide().removeClass('active').eq(v).addClass('active').fadeIn(function() {
								if (typeof self.options.onAfterSelect == 'function') {
									self.options.onAfterSelect.call(self, v);
								}
							});
						}
					/*
					} else if (k === 'href' && v !== '') {
						// @todo not working
						self.$content.find('.active').load(v);
					*/
					}
				});
				return self;
			},

		});
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
			obj.toggle();
		});
	};


	$.fn[pluginName].defaults = {
		active: 0
		,onBeforeSelect: null
		,onAfterSelect: null
		//,auto_advance: false	// false or milliseconds to wait till advancing
		//,easing: null
		//,href: ''
	};
})(jQuery);
