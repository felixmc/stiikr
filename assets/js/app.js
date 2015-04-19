$(document).ready(function() {

	$(document.body).on('click', '.upvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		e.preventDefault();
		
		var url = '/upvote/' + $post.attr('data-id');
		console.log(url);
		
		console.log('clicked!');
		$.ajax({
			method: 'POST',
			url: url,
			success: function(data) {
				console.log('success!');
				console.log(data);
				$('.score', $post).text(data);
				$post.removeClass('downvoted').toggleClass('upvoted');
			}
		}).always(function(data) {
			console.log('always! ' + url);
		});
		
		return false;
	});
	
	
	
});