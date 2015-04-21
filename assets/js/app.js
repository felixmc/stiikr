'use strict';

$(document).ready(function() {

	$("time.timeago").timeago();	
	
	// vote handling
	$(document.body).on('click', '.vote-button', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		
		var url = '/'+$this.prop('data-action')+'/' + $post.attr('data-id');
		console.log(url);
		
		io.socket.request({
			url: url,
			method: 'POST'
		}, function (response) {
//			console.log('resp: ' + response);
		});
		
		e.preventDefault();
		e.stopPropagation();
		
		return false;
	});
	
	io.socket.on('voteUpdate', function(data) {
		$('.post[data-id="' + data.post + '"] .score-box').attr('data-score', data.score);
		console.log(data);
	});
	
	
});