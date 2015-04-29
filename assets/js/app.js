'use strict';

$(document).ready(function() {

	$(document.body).addClass('pageLoaded');

	$("time.timeago").timeago();

	$(document.body).on('click', '.load-more', function(e) {
		var $this = $(this);
		var $content = $('.content');
		var page = Number($content.attr('data-page'));

		$get('/posts/' + page, function(data) {
			$this.before(data);
			$content.attr('data-page', page + 1);
		})
	});

	// new post animation
	$(document.body).on('click', '.throw', function(e) {
		var $this   = $(this);
		var $header = $this.closest('.new-header');
		var $inputs = $('.input', $header);

		if ($header.hasClass('expanded')) {
			$this.closest('form').submit();
		} else {
			$header.addClass('expanded');

			$inputs.addClass('zoomIn');
		}

		// TODO: integrate with socket io!!

		e.preventDefault();
		e.stopPropagation();

		return false;
	});


	var voteChosenClass = 'chosen';

	// vote handling
	$(document.body).on('click', '.post .vote-button', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');

		if (!$('body').hasClass('authenticated') || $post.is('.stale, .locked')) {
			var $widget = $this.closest('.score-widget');

			$widget.addClass('error animated tada');
			setTimeout(function() {
				$widget.removeClass('error animated tada');
			}, 1500);
		//} else if (!$post.is('.stale, .locked')) {
		} else {
			var url = '/'+$this.attr('data-action') + '/' + $post.attr('data-id');

			io.socket.request({
				url: url,
				method: 'POST'
			}, function (err, response) {
					if (response.statusCode == 200) {
						if (!$this.hasClass(voteChosenClass)) {
							$('.vote-button', $post).removeClass(voteChosenClass);
						}
						$this.toggleClass(voteChosenClass);
					}
			});
		}

		e.preventDefault();
		e.stopPropagation();

		return false;
	});

	io.socket.on('voteUpdate', function(data) {
		var $post = $('.post[data-id="' + data.post + '"]');
		$('.score-box', $post).attr('data-score', data.score);
	});


});
