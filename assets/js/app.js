$(document).ready(function() {

	$(document.body).on('click', '.upvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		e.preventDefault() 
		console.log('clicked!');
		$.post('/upvote/' + $post.attr('data-id'),
		function(data) {
			console.log('success!');
			console.log(data);
			$('.score', $post).text(data);
			$post.removeClass('downvoted').addClass('upvoted');
		}).done(function(data) {
			console.log('done! ' + data);
		}).fail(function(e) {
    	alert( "error" );
			console.log(e);
  	});
		
		return false;
	});
	
	
	
});