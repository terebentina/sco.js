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
 * http://apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, devel:true */
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

	$.fn.scopagination = function(options) {
		var $this = $(this)
			,data = $this.data()
			,tpldata;

		data = $.extend({}, $.fn.scopagination.defaults, data, options);

		if (typeof data.content === 'undefined') {
			return;
		}

		var pagination_template = _.template(
				'<ul data-content="'+data.content+'">' +
				'	<% for (var i=0; i<obj[\'total_pages\']; i++) {' +
				'		var cssclass = "";' +
				'		if (i == current_page) {' +
				'			cssclass += "active";' +
				'		};' +
				'		print(\'<li class="\'+cssclass+\'"><a href="#\'+i+\'">\'+(i+1)+\'</a></li>\');' +
				'	} %>' +
				'</ul>'
			);

		tpldata = {
			current_page: data.active
			,cssclass: data.cssclass
			,total_pages: $(data.content).children().length
		};

		if (!data.auto_hide || tpldata.total_pages > 1) {
			$this.html(pagination_template(tpldata));
			$this.find('ul').scotab({
				auto_hide: true
				//,count_in: 3
				//,count_out: 3
				,cssclass: ''
				,onBeforeSelect: function() {

				}
			});
		}
	};

	$.fn.scopagination.defaults = {
		auto_hide: true
		//,count_in: 3
		//,count_out: 3
		,cssclass: ''
	};
}));
