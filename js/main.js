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

		// $('body').on('click', '.test-1-link', function(event) {
		// 	event.preventDefault();
		// 	var url = $(this).data('pm-url');
		// 	$('#pagemanager').pageManager(url);
		// });

		$('body').on('click', '.add-element', function(event) {
			event.preventDefault();
			$('#pagemanager').append("<h2>This was added later.</h2>");
		});

		// $('h2').animate({
		// 	opacity: 0
		// },{duration: 2000}).promise().then(function(){
		// 	log("Done");
		// });

});
