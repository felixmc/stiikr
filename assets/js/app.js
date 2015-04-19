$(document).ready(function() {

	$(document.body).on('click', '.upvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		
		var url = '/upvote/' + $post.attr('data-id');
		console.log(url);
		
		console.log('clicked!');
		$.ajax(url, {
			method: 'POST'
//			,
//			success: function(data) {
//				console.log('success!');
//				console.log(data);
//				$('.score', $post).text(data);
//				$post.removeClass('downvoted').toggleClass('upvoted');
//			}
		}).always(function(data) {
			console.log('always! ' + url);
		});
		
		e.preventDefault();
		
		return false;
	});
	
	
	
});