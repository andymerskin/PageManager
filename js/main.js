log = function(msg) {
	console.log(msg);
}

jQuery(document).ready(function($) {
		
		$.ajaxSetup({
			cache: false
		});

		$('#pagemanager').pageManager({
			firstPage: 'partials/test-1',
			animate: true,
			animateHeight: true
		});

		$('body').on('click', '.add-element', function(event) {
			event.preventDefault();
			$('#pagemanager').append("<h2>This was added later.</h2>");
		});

});
