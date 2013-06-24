/*
 * jQuery.PageManager.js Plugin
 * Author: @andymerskin
 * Version: 0.1 beta
 * Special thanks to: Barnabas Kendall for his jQuery.values plugin
 * 		to serialize form data for populating forms.
 */

;(function( $, window, document, undefined ) {

	var pluginName = "pageManager",
			
			// default plugin options to be merged with 'options':
			defaults = {
				cache: true,
				cacheForms: true,
				firstPage: '',

				animate: true,
				animationProperties: {
					before: { opacity: 0 },
					after: { opacity: 1 }
				},
				animationDuration: {
					before: 100,
					after: 500
				},
				animationEasing: {
					before: 'swing',
					after: 'swing'
				},
				animateHeight: true,
				animationHeightDuration: 250,
				animationHeightEasing: 'swing'
			},

			// DOM + formData cache object:
			cache = {},

			// State cache. Stores names of states only:
			states = {
				last: null,
				current: null
			},

			// Stores DOM data upon a $.get request for global use:
			$data,

			// Current scoped instance of PageManager:
			$instance,

			// Window object:
			$window = $(window);

	var methods = {
		goto: function( url ) {
			this.show( url );
		}
	}

	function PageManager( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	PageManager.prototype = {
		
		/*
		 *	Rev up the engines.
		 */
		init: function() {
			this.options.animateHeight ? this.element.css('overflow', 'hidden') : null;
			this.show(this.options.firstPage);
		},


		/*
		 *	The Magic: ignite the fire and request a state:
		 */
		show: function( url ) {
			if ( states.current ) {
				this.saveState( states.current );
				states.last = states.current;
			}
			this.unbindEvents();

			states.current = url;

			if ( this.isCached() ) {
				this.restoreState( states.current );
			} else {
				this.newState();
			}
		},


		/*
		 *	State Management (create, save, load):
		 */
		
		// Check if current state is cached:
		isCached: function() {
			return (this.options.cache && cache[states.current]);
		},

		// Create a new state:
		newState: function() {
			$this = this;
			var _url = states.current + '.html';
			$.get(_url, function(data) {
				$data = data;
				$this.options.animate ? $this.renderAnimate() : $this.render();
			});
		},

		// Save the current DOM structure + form data:
		saveState: function(state) {
			// cache[state] = this.element.html();
			cache[state] = { 
				dom: 				this.element.html(),
				formData: 	this.saveFormData()
			}
		},

		// Load a cached state:
		restoreState: function( state ) {
			this.options.animate ? this.renderAnimate( cache[state].dom ) : this.render( cache[state].dom );
		},


		/*
		 *	Rendering methods (animate / show):
		 */
		renderAnimate: function() {
			$this = this;
			this.animateBefore( function() {
				if ( $this.options.animateHeight ) {
					var oldHeight = $this.element.height();
					$this.isCached() ? $this.element.html( cache[states.current].dom ) : $this.element.html($data);

					if ( cache[states.current] ) {
						$this.loadFormData( cache[states.current].formData );
					}

					$this.element.css('height', 'auto');
					var newHeight = $this.element.height();
					$this.element.height(oldHeight).animate( { 'height':newHeight }, { duration: $this.options.animationHeightDuration, easing: $this.options.animationHeightEasing, 
						complete: function() { 
							$this.element.css('height', 'auto');
							$this.animateAfter();
							$this.bindEvents();
						}
					});
				} else {
					$this.isCached() ? $this.element.html( cache[states.current].dom ) : $this.element.html($data);
					
					if ( cache[states.current] ) {
						$this.loadFormData( cache[states.current].formData );
					}

					$this.animateAfter();
					$this.bindEvents();
				}
			});
		},

		render: function() {
			this.isCached() ? this.element.html( cache[states.current].dom ) : this.element.html($data);
		},

		animateBefore: function( complete ) {
			this.element.animate(this.options.animationProperties.before, {duration: this.options.animationDuration.before, easing: this.options.animationEasing.before, complete: complete, queue: false});
		},

		animateAfter: function( complete ) {
			this.element.animate(this.options.animationProperties.after, {duration: this.options.animationDuration.after, easing: this.options.animationEasing.after, complete: complete, queue: false});
		},


		/*
		 *	Saving and Loading Form Data
		 */
		saveFormData: function() {
			if ( this.options.cacheForms ) {
				var formData = {};
				$inputs = this.element.find(':input').get();
				if ( $inputs.length > 0 ) {
					$.each( $inputs, function() {
						if (this.name && !this.disabled && (this.checked
		                        || /select|textarea/i.test(this.nodeName)
		                        || /text|hidden|password/i.test(this.type))) {
		        	formData[this.name] = $(this).val();
		        }
					});
					return formData;
				} else {
					return {};
				}
			} 		
		},

		loadFormData: function( formData ) {
			if ( this.options.cacheForms ) {
				$inputs = this.element.find(':input').get();
				$.each( $inputs, function() {
					if (this.name && formData[this.name]) {
		        if(this.type == 'checkbox' || this.type == 'radio') {
		          $(this).attr("checked", (formData[this.name] == $(this).val()));
		        } else {
		          $(this).val(formData[this.name]);
		        }
		      }
				});
				return $(this);
			}
		},


		/*
		 *	Event Binding to Kill off the Zombies
		 */
		bindEvents: function() {
			$actions = $('[data-pm-url]');
			$actions.each( function() {
				$(this, window).on('click.pageManager', function(event) {
					event.preventDefault();
					$instance.show( $(this).data('pm-url') );
				});
			});
		},

		unbindEvents: function() {
			$actions = $('[data-pm-url]');
			$actions.each( function() {
				$('[data-pm-url]', window).off('click.pageManager');
			});
		}

	} // end PageManager.prototype


	/*
	 *	jQuery method:
	 */
	$.fn[pluginName] = function( param ) {
		if ( typeof param === 'object' || ! param ) {
			$instance = new PageManager( this, param );
			// return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1));
		} else {
			$instance.show(param);
		}

		// return this.each(function() {
		// 	if (!$.data(this, "plugin_" + pluginName)) {
		// 		$.data(this, "plugin_" + pluginName,
		// 		new PageManager( this, options ));
		// 	}
		// });
	}

})( jQuery, window, document );