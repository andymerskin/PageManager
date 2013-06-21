(function($) {

	$.ajaxSetup({
		cache: false
	});

	var options = {
		validate: false,
		cache: true,
		container: "#pagemanager"
	};

	var cache = {};
	var states = {
		last: null,
		current: null
	};

	var pub = {

		load: function(url) {
			_show(url);
		}

	}

	function _init( opts ) {
		$.extend(options, opts || {});

	}

	function _show( state ) {
		if ( states.current ) {
			_saveState( states.current );
			states.last = states.current;
		}

		if ( cache[state] ) {
			log(state + " exists!");
			_restoreState( state );
		} else {
			log("Rendering page: " + state);
			_renderState( state );
		}
	}

	function _renderState(url) {
		var _url = url + '.html';
		$.get(_url, function(data) {
			$(options.container).html(data);
			states.current = url;
		});
	}

	function _saveState( state ) {
		cache[state] = $(options.container).html();
	}

	function _restoreState( state ) {
		$(options.container).html( cache[state] );
		states.current = state;
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