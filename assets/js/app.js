$(document).ready(function() {

	$('body').on('click', '.upvote', function() {
		var $this = $(this);
		var $post = $this.parent('.post');
		$.post({
			url: '/upvote/' + $post.attr('data-id')
		}, function(data) {
			console.log(data);
			$post.removeClass('downvoted').addClass('upvoted');
		});
	});
	
	
	
});