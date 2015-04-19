'use strict';

$(document).ready(function() {

	$(document.body).on('click', '.upvote', function(e) {
		var $this = $(this);
		var $post = $this.closest('.post');
		
		var url = '/upvote/' + $post.attr('data-id');
		console.log(url);
		
		
		//var socket = io.connect('http://localhost:1337');

//		io.socket.on('connect', function () {

			// Request data from '/user' route over socket
			// The second argument is an arbitrary set of data
			// Here, If we haven't overridden the scaffold, and assuming you have a user model,
			// socket.request() will respond with the first 3 users from your database.
			// This will also automatically subscribe us to realtime updates for those 3 users
			// as well as any new users added to the collection.
			io.socket.request(url, {
				limit: 3
			}, function (response) {
				// Here's what the server responded with
				console.log(response);
			});
//		});
		
		
//		console.log('clicked!');
		//var ajax = $.post(url, function(data, status) {
			//console.log('success!');
			//console.log(data);
				//$('.score', $post).text(data);
				//$post.removeClass('downvoted').toggleClass('upvoted');
		//});
		
		//console.log(ajax);
		
		e.preventDefault();
		e.stopPropagation();
		
		return false;
	});
	
	
	
});