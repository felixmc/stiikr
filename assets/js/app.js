'use strict';

$(document).ready(function() {

	$(document.body).on('click', '.upvote, .downvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		
		var url = '/'+$this.getClass()+'/' + $post.attr('data-id');
		console.log(url);
		
		io.socket.request({
			url: url,
			method: 'POST'
		}, function (response) {
			console.log('resp: ' + response);
		});
		
		e.preventDefault();
		e.stopPropagation();
		
		return false;
	});
	
	io.socket.on('voteUpdate', function(data) {
		$('.post[data-id="'+data.post+'"] .score').text(data.score);
		console.log(data);
	});
	
	
});