/* ==========================================================
 * sco.tab.js
 * http://code.google.com/p/scojs/
 * ==========================================================
 * Copyright 2012 Dan Caragea.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function($) {
	"use strict";

	function Tab($tabs, options) {
		var self = this;

		$.extend(self, {
			options: {
				auto_advance: false	// false or milliseconds to wait till advancing
				,easing: null
				,active: -1
				,href: ''
			},

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
				for (var p in map) {
					if (map.hasOwnProperty(p)) {
						if (typeof self.options[p] !== 'undefined') {
							if (p === 'active') {
								// if
								if (map[p] !== self.get('active')) {
									var $header_children = self.$tabs.children();
									// remove the .active class from all tab headers and add .active to selected tab header
									$header_children.removeClass('active').eq(map[p]).addClass('active');
									// hide all tab content and show only the selected one
									self.$content.hide().removeClass('active').eq(map[p]).addClass('active').fadeIn();
								}
							} else if (p === 'href' && map[p] != '') {
								// @todo not working
								self.$content.find('.active').load(map[p]);
							}

							if (save) {
								self.options[p] = map[p];
							}
						}
					}
				}
				return self;
			},

			_init: function() {
				self.$tabs = $tabs;
				var data = self.$tabs.data();
				self.$content = $(data.content).children();
				if (typeof data.active === 'undefined') {
					data.active = 0;
				}

				self.$tab_links = self.$tabs.find('a');
				self.$tab_links.unbind('.scotab').bind('click.scotab', function(e) {
					var $this = $(this)
						,$my_li = $this.parents('li')
						,my_index = $my_li.index()
						,map = {active: my_index};

					// @todo not working
					if ($this.attr('href').indexOf('#') !== 0) {
						e.preventDefault();
						map.href = $this.attr('href');
					}

					self.set(map);
				});

				data = $.extend(true, {}, self.options, data, options);
				self.set(data);

				if ($.address) {
					$.address.externalChange(function(e) {
						var hash = '#' + e.value.slice(1);
						self.$tab_links.each(function(i) {
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
}(window.jQuery);
