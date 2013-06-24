;(function( $, window, document, undefined ) {

	var pluginName = "pageManager",
			defaults = {
				validate: false,
				cache: true,
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
			cache = {},
			states = {
				last: null,
				current: null
			},
			$data,
			$instance;

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
		
		init: function() {
			this.options.animateHeight ? this.element.css('overflow', 'hidden') : null;
			this.show(this.options.firstPage);
		},

		show: function( url ) {
			if ( states.current ) {
			this.saveState( states.current );
				states.last = states.current;
			}

			states.current = url;

			if ( this.isCached() ) {
				this.restoreState();
			} else {
				this.newState();
			}
		},

		isCached: function() {
			return (this.options.cache && cache[states.current]);
		},

		newState: function() {
			$this = this;
			var _url = states.current + '.html';
			$.get(_url, function(data) {
				$data = data;
				$this.options.animate ? $this.renderAnimate() : $this.render();
			});
		},

		saveState: function(state) {
			cache[state] = this.element.html();
		},

		restoreState: function( state ) {
			this.options.animate ? this.renderAnimate( cache[state] ) : this.render( cache[state] );
		},

		renderAnimate: function() {
			$this = this;
			this.animateBefore( function() {
				if ( $this.options.animateHeight ) {
					var oldHeight = $this.element.height();
					$this.isCached() ? $this.element.html(cache[states.current]) : $this.element.html($data);
					$this.element.css('height', 'auto');
					var newHeight = $this.element.height();
					$this.element.height(oldHeight).animate( { 'height':newHeight }, { duration: $this.options.animationHeightDuration, easing: $this.options.animationHeightEasing, 
						complete: function() { 
							$this.element.css('height', 'auto');
							$this.animateAfter();
						}
					});
				} else {
					$this.isCached() ? $this.element.html(cache[states.current]) : $this.element.html($data);
					$this.animateAfter();
				}
			});
		},

		render: function() {
			this.isCached() ? this.element.html(cache[states.current]) : this.element.html($data);
		},

		animateBefore: function( complete ) {
			this.element.animate(this.options.animationProperties.before, {duration: this.options.animationDuration.before, easing: this.options.animationEasing.before, complete: complete, queue: false});
		},

		animateAfter: function( complete ) {
			this.element.animate(this.options.animationProperties.after, {duration: this.options.animationDuration.after, easing: this.options.animationEasing.after, complete: complete, queue: false});
		}
	}

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