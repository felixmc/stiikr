'use strict';

$(document).ready(function() {

	$(document.body).on('click', '.upvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		
		var url = '/upvote/' + $post.attr('data-id');
		console.log(url);
		
//		console.log('clicked!');
		var ajax = $.post(url, function(data) {
			console.log('success!');
			//console.log(data);
				//$('.score', $post).text(data);
				//$post.removeClass('downvoted').toggleClass('upvoted');
		});
		
		console.log(ajax);
		
//		ajax.complete(function(data) {
//			console.log('done');
//		});
		
		e.preventDefault();
		e.stopPropagation();
		
		return false;
	});
	
	
	
});