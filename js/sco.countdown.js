/* ==========================================================
 * sco.countdown.js
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

	var pluginName = 'scojs_countdown';

	function doit($elem, data, until) {
		var str = ''
			,started = true
			,left = {}
      ,secondsLeft = 0
			,js_current = Math.round((new Date()).getTime() / 1000)
      ,keepGoing = function() { return left[data.granularity] == null }
      ,getRefreshTime = function() {
        if (data.granularity === 'd')
          return left.d ? (secondsLeft % 86400 || 1) : 1;
        if (data.granularity === 'h')
          return left.h ? (secondsLeft % 3600 || 1) : 1;
        if (data.granularity === 'm')
          return left.m ? (secondsLeft % 60 || 1) : 1;

        return 1;
      };

		secondsLeft = until - js_current;

		if (secondsLeft < 0) {
			return;
		}

		if (Math.floor(secondsLeft / 86400) > 0) {
			left.d = Math.floor(secondsLeft / 86400);
			secondsLeft = secondsLeft % 86400;
			str += left.d + data.strings.d;
			started = keepGoing()
		}

		if (started && Math.floor(secondsLeft / 3600) > 0) {
			left.h = Math.floor(secondsLeft / 3600);
			secondsLeft = secondsLeft % 3600;
			str += ' ' + left.h + data.strings.h;
			started = keepGoing();

		}

		if (started && Math.floor(secondsLeft / 60) > 0) {
			left.m = Math.floor(secondsLeft / 60);
			secondsLeft = secondsLeft % 60;
			str += ' ' + left.m + data.strings.m;
			started = keepGoing();
		}

		if (started && secondsLeft > 0) {
      left.s = secondsLeft;
			str += ' ' + left.s + data.strings.s;
		}

		$elem.html(str);
    var refreshMs = getRefreshTime() * 500;
		setTimeout(function() {doit($elem, data, until);}, refreshMs)
	}

	$.fn[pluginName] = function(options) {
		var $this = $(this)
			,data = $this.data()
			,js_current
			;

		data = $.extend({}, $.fn[pluginName].defaults, options, data);

		if (!data.until) {
			return;
		}

		js_current = Math.round((new Date()).getTime() / 1000);
		if (!data.current) {
			data.current = js_current;
		}

		data.until -= (js_current - data.current);

		doit($this, data, data.until);
	};

	$.fn[pluginName].defaults = {
		strings: {d: 'd', h: 'h', m: 'm', s: 's'},
    granularity: 's'
	};
})(jQuery);
