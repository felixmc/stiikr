function handleVote(req, res, voteValue) {
	if (req.method === 'POST' && req.session.authenticated) {
		Post.find( req.param('id') )
		.populate('votes')
		.exec(function(err, post) {
			if (err)
				sails.log.error(err);

			if (post) {
				post = post[0];
				var vote = _.find(post.votes, { user: req.session.user.id });

				if (vote) {
					var newValue = vote.value == voteValue ? 0 : voteValue;
					Vote.update(vote.id, { value: newValue })
					.exec(function(err, newVote) {
						newVote = newVote[0];
						if (err) {
							sails.log.error(err);
							res.serverError();
						} else {
							req.socket.emit('voteUpdate', { post: post.id, score: post.calculateScore() + (newVote.value - vote.value) });
							res.ok();
						}
					});
				} else {
					Vote.create({
						user:  req.session.user.id,
						post:  post.id,
						value: voteValue
					}).exec(function(err, vote) {
						if (err) {
							sails.log.error(err);
							res.serverError();
						} else {
							req.socket.emit('voteUpdate', { post: post.id, score: post.calculateScore() + voteValue });
							res.ok();							
						}
					});
				}
			} else {
				res.notFound();			
			}
		});			
	} else {
		res.notFound();
	}
}

// Main Controller
module.exports = {

	index: function(req, res) {
		Post.find({ limit: 10, sort: 'createdAt DESC' })
		.populate('author')
		.populate('votes')
		.exec(function(err, posts) {
			if (err)
				sails.log.error(err);
			
			_.each(posts, function(post) {
				post.calculateScore();
				post.createdAtISO = post.createdAt.toISOString();
			});
			
			res.render('home', { user: req.session.user, posts: posts });
		});
	},
	
	post: function(req, res) {
		Post.find(req.param('id'))
		.populate('author')
		.populate('votes')
		.exec(function(err, post) {
			if (err) {
				sails.log.error(err);
				res.serverError();
			} else if (post) {
				post = post[0];
				post.calculateScore();
	
				res.render('post', post);
			} else {
				res.notFound();
			}
		});
	},
	
	upvote: function(req, res) {
		handleVote(req, res, 1);
	},
	
	downvote: function(req, res) {
		handleVote(req, res, -1);	
	}, 
	
	new: function(req, res) {
		if (req.method === 'POST' && req.session.authenticated) {
			Post.create({
				title:   req.param('title'),
				content: req.param('desc'),
				author:  req.session.user.id
			}).exec(function(err, post) {
				if (err)
					sails.log.error(err);
								
				res.redirect('/');
			});
		} else {
			res.notFound();
		}
	}
	
};