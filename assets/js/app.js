$(document).ready(function() {

	$(document.body).on('click', '.upvote', function() {
		var $this = $(this);
		var $post = $this.closest('.post');
		console.log($post);
		console.log($post.attr('data-id'));
		$.post( '/upvote/' + $post.attr('data-id'),
		function(data) {
			console.log(data);
			$('.score', $post).text(data);
			$post.removeClass('downvoted').addClass('upvoted');
		});
	});
	
	
	
});