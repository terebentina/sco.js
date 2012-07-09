/* ==========================================================
 * sco.tab.js
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

	function Tab($tabs, options) {
		var self = this;

		$.extend(self, {
			options: {},
			$tabs: null,
			$content: null,

			get: function(key) {
				if (typeof self.options[key] !== 'undefined') {
					return self.options[key];
				}

				return undefined;
			},

			set: function(map, save) {
				if (typeof save === 'undefined') {
					save = true;
				}
				$.each(map, function(k, v) {
					if (k === 'active') {
						if (v !== self.get('active')) {
							if (typeof self.options.onBeforeSelect == 'function') {
								self.options.onBeforeSelect.call(self, v);
							}
							var $header_children = self.$tabs.children();
							// remove the .active class from all tab headers and add .active to selected tab header
							$header_children.removeClass('active').eq(v).addClass('active');
							// hide all tab content and show only the selected one
							self.$content.hide().removeClass('active').eq(v).addClass('active').fadeIn(function() {
								if (typeof self.options.onAfterSelect == 'function') {
									self.options.onAfterSelect.call(self, v);
								}
							});
						}
					//} else if (k === 'href' && v !== '') {
					//	// @todo not working
					//	self.$content.find('.active').load(v);
					}

					if (save) {
						self.options[k] = v;
					}
				});
				return self;
			},

			_init: function() {
				self.$tabs = $tabs;
				var data = self.$tabs.data();
				if (typeof data.content === 'undefined') {
					return;
				}
				self.$content = $(data.content).children();

				data = $.extend({}, $.fn.scotab.defaults, data, options);

				self.$tabs.on('click.scotab', 'a', function(e) {
					var $this = $(this)
						,$my_li = $this.parents('li')
						,my_index = $my_li.index()
						,map = {active: my_index};

					if (!$.address) {
						e.preventDefault();
					}
					// @todo not working
					//if ($this.attr('href').indexOf('#') !== 0) {
					//	e.preventDefault();
					//	map.href = $this.attr('href');
					//}

					self.set(map);
				});

				// allow plugins to add their own custom init code. Note that self.$tabs and self.$content is available in onInit()
				if (typeof data.onInit === 'function') {
					data.onInit.call(self, data);
					delete data.onInit;
				}
				if (typeof data.onBeforeSelect === 'function') {
					self.options.onBeforeSelect = data.onBeforeSelect;
					delete data.onBeforeSelect;
				}
				if (typeof data.onAfterSelect === 'function') {
					self.options.onAfterSelect = data.onAfterSelect;
					delete data.onAfterSelect;
				}

				// finally, set the initial values
				self.set(data);

				if ($.address) {
					$.address.externalChange(function(e) {
						var hash = '#' + e.value.slice(1);
						self.$tabs.find('a').each(function(i) {
							if ($(this).attr('href') === hash) {
								self.set({active: i});
								return false;
							}
						});
					}).history(true);
				}

				return self;
			}
		});

		self._init();
	}


	$.fn.scotab = function(options) {
		if (typeof options === 'undefined') {
			options = {};
		}
		this.each(function() {
			$(this).data("scotab", new Tab($(this), options));
		});

		return this;
	};


	$.fn.scotab.defaults = {
		active: 0
		,onBeforeSelect: null
		,onAfterSelect: null
		//,auto_advance: false	// false or milliseconds to wait till advancing
		//,easing: null
		//,href: ''
	};
}));
