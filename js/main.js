log = function(msg) {
	console.log(msg);
}

jQuery(document).ready(function($) {
	
		$.pageManager({
			firstPage: 'partials/test-1',
			animate: true,
			animateHeight: true
		});

		$('body').on('click', '.test-1-link', function(event) {
			event.preventDefault();
			var url = $(this).data('url');
			$.pageManager('goto', url);
		});

		$('body').on('click', '.add-element', function(event) {
			event.preventDefault();
			$('#pagemanager').append("<h2>This was added later.</h2>");
		});

		var $h2 = $('h2');

		$('h2').animate({
			opacity: 0
		},{duration: 2000}).promise().then(function(){
			log("Done");
		});

});
