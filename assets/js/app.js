'use strict';

$(document).ready(function() {

	$(document.body).on('click', '.upvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		
		var url = '/upvote/' + $post.attr('data-id');
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
	
	io.socket.on('news', function(data) {
		console.log(data);
	});
	
	
});