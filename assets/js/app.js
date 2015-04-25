'use strict';

$(document).ready(function() {

	$("time.timeago").timeago();

	// login form nonsense
	$(document.body).on('click', '.throw', function(e) {
		var $this   = $(this);
		var $header = $this.closest('.header');

		if ($header.hasClass('expanded')) {
			$this.closest('form').submit();
		} else {
			$header.addClass('expanded');
		}

		e.preventDefault();
		e.stopPropagation();

		return false;
	});




	var voteChosenClass = 'chosen';

	// vote handling
	$(document.body).on('click', '.post:not(.stale, .locked) .vote-button', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');

		var url = '/'+$this.attr('data-action')+'/' + $post.attr('data-id');
//		console.log(url);

		io.socket.request({
			url: url,
			method: 'POST'
		}, function (err, response) {
			console.log(response);
//			console.log('resp: ' + response);
		});

		if (!$this.hasClass(voteChosenClass)) {
			$('.vote-button', $post).removeClass(voteChosenClass);
		}
		$this.toggleClass(voteChosenClass);

		e.preventDefault();
		e.stopPropagation();

		return false;
	});

	io.socket.on('voteUpdate', function(data) {
		var $post = $('.post[data-id="' + data.post + '"]');

		$('.score-box', $post).attr('data-score', data.score);
//		console.log(data);
	});


});
