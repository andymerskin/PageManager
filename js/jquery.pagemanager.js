(function($) {

	$.ajaxSetup({
		cache: false
	});

	var options = {
		validate: false,
		cache: true,
		container: "#pagemanager",
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
	};

	var cache = {},
		states = {
			last: null,
			current: null
		},
		$container,
		$data;

	var pub = {

		// Public methods for use with constructor.
		// Call with a string, arguments second.
		 
		goto: function(url) {
			_show(url);
		}

	}

	function _init( opts ) {
		$.extend(options, opts || {});
		$container = $(options.container);
		options.animateHeight ? $container.css('overflow', 'hidden') : null;
		_show(options.firstPage);
	}

	function _show( url ) {
		if ( states.current ) {
			_saveState( states.current );
			states.last = states.current;
		}

		states.current = url;

		if ( _isThisStateCached() ) {
			_restoreState();
		} else {
			_newState();
		}
	}

	// Check if current state is cached.
	function _isThisStateCached() {
		return (options.cache && cache[states.current]);
	}

	// Check if passed state is cached.
	function _isStateCached( state ) {
		return (options.cache && cache[state]);
	}

	// Cache a state OR overwrite existing cache entry for a page.
	function _saveState( state ) {
		cache[state] = $container.html();
	}

	// Create brand new state + make request to grab page DOM data.
	function _newState() {
		var _url = states.current + '.html';
		$.get(_url, function(data) {
			$data = data;
			options.animate ? _renderAnimate() : _render();
		});
	}

	// Restore cached state with DOM data.
	function _restoreState( state ) {
		options.animate ? _renderAnimate( cache[state] ) : _render( cache[state] );
	}

	// Used to be animateHeight for cached entries:
	function _renderAnimate() {
		_animateBefore( function() {
			if ( options.animateHeight ) {
				var oldHeight = $container.height();
				_isThisStateCached() ? $container.html(cache[states.current]) : $container.html($data);
				$container.css('height', 'auto');
				var newHeight = $container.height();
				$container.height(oldHeight).animate( { 'height':newHeight }, { duration: options.animationHeightDuration, easing: options.animationHeightEasing, 
					complete: function() { 
						$container.css('height', 'auto');
						_animateAfter();
					}
				});
			} else {
				_isThisStateCached() ? $container.html(cache[states.current]) : $container.html($data);
				_animateAfter();
			}
		});
	}

	function _render(data) {
		_isThisStateCached() ? $container.html(cache[states.current]) : $container.html($data);
	}

	function _animateBefore( complete ) {
		$container.animate(options.animationProperties.before, {duration: options.animationDuration.before, easing: options.animationEasing.before, complete: complete, queue: false});
	}

	function _animateAfter( complete ) {
		$container.animate(options.animationProperties.after, {duration: options.animationDuration.after, easing: options.animationEasing.after, complete: complete, queue: false});
	}

	$.pageManager = function(method) {

		// If 'method' exists in the 'pub' object.
		if ( pub[method] ) {

			// Call the method inside 'pub' in the 'pageManager' context with all of the arguments after the first argument of the 'pageManager' method, which is the method we're referring to.
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));

		// Or, if the argument is an object:
		} else if (typeof method === "object" || !method) {

			// Pass the object to '_init' to change the options.
			return _init.apply(this, arguments);
		}
		return this;
	}

})(jQuery);