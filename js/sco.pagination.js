/* ==========================================================
 * sco.pagination.js
 * http://github.com/terebentina/sco.js
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

/*jshint laxcomma:true, sub:true, browser:true, jquery:true */
/*global define:true, _:true */

(function(factory) {
	"use strict";

    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
			'sco.tab.js',
			'../underscore.js'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function($) {
	"use strict";

	$('[data-trigger="pagination"]').scotab({
		auto_hide: true
		,count_in: 3
		,count_out: 3
		,cssclass: ''
		,onInit: function(options) {
			var pagination_template = _.template(
					'<ul>' +
					'	<li class="prev <%= current_page === 0 ? "disabled" : "" %>">' +
					'		<a href="#">&larr; Previous</a>' +
					'	</li>' +
					'	<% for (var i=0; i<total_pages; i++) {' +
					'		var cssclass = "";' +
					'		if (i == current_page) {' +
					'			cssclass += "active";' +
					'		}' +
					//'		if (content == "&hellip;") {' +
					//'			cssclass += " disabled";' +
					//'		}' +
					'		print("<li class=\""+cssclass+"\"><a href=\"#"+i+"\">"+(i+1)+"</a></li>");' +
					'	} %>' +
					'	<li class="next <%= next_page === false ? "disabled" : "" %>">' +
					'		<a href="#">Next &rarr;</a>' +
					'	</li>' +
					'</ul>'
				)
				,data = {
					current_page: options.active
					,cssclass: options.cssclass
					,total_pages: 0
				};
			data.total_pages = this.$content.length;
			if (data.total_pages > 1) {
				this.$tabs.html(pagination_template(data));
			}
		}
		,onSelect: function() {

		}
	});
}));
