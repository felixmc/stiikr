$(document).ready(function() {

	$(document.body).on('click', '.upvote', function() {
		var $this = $(this);
		var $post = $this.closest('.post');
		$.post( '/upvote/' + $post.attr('data-id'),
		function(data) {
			console.log(data);
			$('.score', $post).text(data);
			$post.removeClass('downvoted').addClass('upvoted');
		}).done(function(data) {
			console.log('done! ' + data);
		});
	});
	
	
	
});