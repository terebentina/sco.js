/* ==========================================================
 * sco.valid.js
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

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, smarttabs:true */
/*global define:true */

(function (factory) {
	"use strict";

    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery', 'jquery.form.js'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function($) {
	"use strict";

	$.scovalid = function( $form, options ) {
		this.$form = $form;
		this.options = $.extend({}, $.scovalid.defaults, options);
		this.allowed_rules = [];
		this.errors = {};
		var that = this;
		$.each(this.methods, function(k,v) {
			that.allowed_rules.push(k);
		});
	};

	$.extend($.scovalid, {
		defaults: {
			// the tag that wraps the field and possibly the label and which defines a "row" of the form
			wrapper: 'label',
			// array of rules to check the form against. Each value should be either a string with the name of the method to use as rule or a hash like {method: <method params>}
			rules: {},
			// custom error messages like {username: {not_empty: 'hey you forgot to enter your username', min_length: 'come on, more than 2 chars, ok?'}, password: {....}}
			messages: {}
		},


		prototype: {
			// this is the main function - it returns either true if the validation passed or a hash like {field1: 'error text', field2: 'error text', ...}
			validate: function() {
				var that = this,
					form_fields = this.$form.serializeArray();

				// remove any possible displayed errors from previous runs
				$.each(this.errors, function(field_name, error) {
					var $input = that.$form.find('[name='+field_name+']');
					$input.siblings('span').html('');
					if (that.options.wrapper !== null) {
						$input.parents(that.options.wrapper).removeClass('error');
					}
				});
				this.errors = {};

				$.each(that.options.rules, function(field_name, rules) {
					var field = null;
					// find the field in the form
					$.each(form_fields, function(k, v) {
						if (v.name === field_name) {
							field = v;
							return false;
						}
					});
					// if field was not found, it could mean 2 things: mispelled field name in the rules or the field is not a successful control
					// either way, we build a fake field and it should fail one of the assigned rules later on.
					if (field === null) {
						field = {name: field_name, value: null};
					}

					$.each(rules, function(rule_idx, rule_value) {
						// determine the method to call and its args
						var fn_name, fn_args, result;
						// only string and objects are allowed
						if ($.type(rule_value) === 'string') {
							fn_name = rule_value;
						} else {
							// if not string then we assume it's a {key: val} object. Only 1 key is allowed
							$.each(rule_value, function(k, v) {
								fn_name = k;
								fn_args = v;
								return false;
							});
						}

						// make sure the requested method actually exists.
						if ($.inArray(fn_name, that.allowed_rules) !== -1) {
							// call the method with the requested args
							result = that.methods[fn_name].call(that, field_name, field.value, fn_args);
							if (result !== true) {
								that.errors[field.name] = that.format.call(that, field.name, fn_name, fn_args);
							}
						}
					});
				});

				if (!$.isEmptyObject(this.errors)) {
					this.show(this.errors);
					return false;
				} else {
					return true;
				}
			},


			show: function(errors) {
				var that = this;
				$.each(errors, function(k, v) {
					var $input = that.$form.find('[name='+k+']'),
						$span = $input.siblings('span');
					if (that.options.wrapper !== null) {
						$input.parents(that.options.wrapper).addClass('error');
					}
					if ($span.length === 0) {
						$span = $('<span/>');
						$input.after($span);
					}
					$span.html(v);
				});
			},


			methods: {
				not_empty: function(field, value) {
					return value !== null && $.trim(value).length > 0;
				},

				min_length: function(field, value, min_len) {
					return $.trim(value).length >= min_len;
				},

				max_length: function(field, value, max_len) {
					return $.trim(value).length <= max_len;
				},

				regex: function(field, value, regexp) {
					return regexp.test(value);
				},

				email: function(field, value) {
					// by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
					var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
					return regex.test($.trim(value));
				},

				url: function(field, value, params) {
					// by Scott Gonzalez: http://projects.scottsplayground.com/iri/
					var regex = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
					return regex.test(value);
				},

				exact_length: function(field, value, exact_length) {
					return $.trim(value).length === exact_length;
				},

				equals: function(field, value, target) {
					return value === target;
				},

				ip: function(field, value) {
					var regex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i;
					return regex.test($.trim(value));
				},

				credit_card: function(field, value, params) {
					// accept only spaces, digits and dashes
					if (/[^0-9 \-]+/.test(value)) {
						return false;
					}
					var nCheck = 0,
						nDigit = 0,
						bEven = false;

					value = value.replace(/\D/g, "");

					for (var n = value.length - 1; n >= 0; n--) {
						var cDigit = value.charAt(n);
						nDigit = parseInt(cDigit, 10);
						if (bEven) {
							if ((nDigit *= 2) > 9) {
								nDigit -= 9;
							}
						}
						nCheck += nDigit;
						bEven = !bEven;
					}

					return (nCheck % 10) === 0;
				},

				alpha: function(field, value) {
					var regex = /^[a-z]+$/i;
					return regex.test(value);
				},

				alpha_numeric: function(field, value) {
					var regex = /^[a-z0-9]+$/i;
					return regex.test(value);
				},

				alpha_dash: function(field, value) {
					var regex = /^[a-z0-9_\-]+$/i;
					return regex.test(value);
				},

				digit: function(field, value) {
					var regex = /^\d+$/;
					return regex.test(value);
				},

				numeric: function(field, value, params) {
					var regex = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
					return regex.test(value);
				},

				range: function(field, value, params) {

				},

				decimal: function(field, value, params) {
					var regex = /^\-?[0-9]*\.?[0-9]+$/;
					return regex.test(value);
				},

				color: function(field, value, params) {

				},

				matches: function(field, value, param) {
					return value === this.$form.find('[name='+param+']').val();
				}
			},


			messages: {
				not_empty: 'This field is required.',
				min_length: 'Please enter at least :value characters.',
				max_length: 'Please enter no more than :value characters.',
				regex: '',
				email: 'Please enter a valid email address.',
				url: 'Please enter a valid URL.',
				exact_length: 'Please enter exactly :value characters.',
				equals: '',
				ip: '',
				credit_card: 'Please enter a valid credit card number.',
				alpha: '',
				alpha_numeric: '',
				alpha_dash: '',
				digit: 'Please enter only digits.',
				numeric: 'Please enter a valid number.',
				range: 'Please enter a value between :min and :max.',
				decimal: 'Please enter a decimal number.',
				color: '',
				matches: 'Must match the previous value.'
			},


			/**
			 * finds the most specific error message string and replaces any ":value" substring with the actual value
			 */
			format: function(field_name, rule, params) {
				var message;
				if (typeof this.options.messages[field_name] !== 'undefined' && typeof this.options.messages[field_name][rule] !== 'undefined') {
					message = this.options.messages[field_name][rule];
				} else {
					message = this.messages[rule];
				}

				if ($.type(params) !== 'undefined') {
					if ($.type(params) === 'boolean' || $.type(params) === 'string' || $.type(params) === 'number') {
						params = {value: params};
					}
					$.each(params, function(k, v) {
						message = message.replace(new RegExp(':'+k, 'ig'), v);
					});
				}
				return message;
			}
		}
	});


	/**
	 * main function to use on a form (like $('#form).scovalid({...})). Performs validation of the form, sets the error messages on form inputs and returns
	 * true/false depending on whether the form passed validation or not
	 *
	 * @param hash/string options the hash of rules and messages to validate the form against (and messages to show if failed validation) or the string "option"
	 * @param {string} key the option key to retrieve or set. If the third param of the function is available then act as a setter, otherwise as a getter.
	 * @param {mixed} value the value to set on the key
	 */
	$.fn.scovalid = function( options, key, value ) {
		var $form = this.eq(0),
			validator = $form.data('scovalid');
		if ($.type(options) === 'object') {
			if (!validator) {
				validator = new $.scovalid($form, options);
				$form.data("scovalid", validator).attr('novalidate', 'novalidate');
			}
			$form.ajaxForm({
				beforeSubmit: function(arr, $form, options) {
					return validator.validate();
				}
				,dataType: 'json'
				,success: function(response, status, xhr, $form) {
					if (response.status == 'fail') {
						$form.scovalid().show(response.data.errors);
					} else if (response.status == 'error') {
						$.scomessage(response.message);
					} else if (response.status == 'success') {
						if (typeof response.data.run === 'function') {
							response.data.run.call(this, $form);
						}
						if (response.data.next) {
							if (response.data.next === '.') {			// refresh current page
								window.location.href = window.location.href;
							} else if (response.data.next === 'x') {	// close the parent modal
								$form.parents('.modal').trigger('close');
							} else {
								window.location.href = response.data.next;
							}
						}
						if (response.data.message) {
							$.scomessage(response.data.message, $.scomessage.TYPE_OK);
						}
					}
				}
			});
			// allow chaining
			return this;
		} else if (options === 'option') {
			if ($.type(value) === 'undefined') {
				return validator.options[key];
			} else {
				validator.options[key] = value;
				return validator;
			}
		} else {
			return validator;
		}
	};
}));
