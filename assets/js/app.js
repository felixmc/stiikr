'use strict';

$(document).ready(function() {

	$("time.timeago").timeago();	
	
	var voteChosenClass = 'chosen';
	
	// vote handling
	$(document.body).on('click', '.vote-button', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		
		var url = '/'+$this.attr('data-action')+'/' + $post.attr('data-id');
//		console.log(url);
		
		io.socket.request({
			url: url,
			method: 'POST'
		}, function (response) {
//			console.log('resp: ' + response);
		});
		
		e.preventDefault();
		e.stopPropagation();

		if ($this.hasClass(voteChosenClass)) {
			$this.removeClass(voteChosenClass);
		} else {
			$('.vote-button', $post).removeClass(voteChosenClass);
			$this.addClass(voteChosenClass);
		}
		
		return false;
	});
	
	io.socket.on('voteUpdate', function(data) {
		var $post = $('.post[data-id="' + data.post + '"]');
		
		$('.score-box', $post).attr('data-score', data.score);
//		console.log(data);
	});
	
	
});