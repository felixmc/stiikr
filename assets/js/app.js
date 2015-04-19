$(document).ready(function() {

	$(document.body).on('click', '.upvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		e.preventDefault();
		
		var url = '/upvote/' + $post.attr('data-id');
		
		console.log('clicked!');
		$.post({
			url: url,
			success: function(data) {
				console.log('success!');
				console.log(data);
				$('.score', $post).text(data);
				$post.removeClass('downvoted').addClass('upvoted');
			},
		});
		
		return false;
	});
	
	
	
});