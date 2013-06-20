log = function(msg) {
	console.log(msg);
}

jQuery(document).ready(function($) {
	
		$.pageManager('load', 'partials/test-1');

		$('body').on('click', '.test-1-link', function(event) {
			event.preventDefault();
			var url = $(this).data('url');
			$.pageManager('load', url);
		});

		$('body').on('click', '.add-element', function(event) {
			event.preventDefault();
			$('#pagemanager').append("<h2>This was added later.</h2>");
		});

});