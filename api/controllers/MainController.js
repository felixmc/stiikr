function handleVote(req, res, voteValue) {
	if (req.method === 'POST' || req.session.authenticated) {
		Post.find( req.param('id') )
		.populate('votes')
		.exec(function(err, post) {
			if (err)
				sails.log.error(err);

			if (post) {
				post = post[0];
//				console.log(post);
					
				var vote = _.find(post.votes, { user: req.session.user.id });

				if (vote) {
					var newValue = vote.value == voteValue ? 0 : voteValue;
					Vote.update(vote.id, { value: newValue })
					.exec(function(err, vote) {
						if (err) {
							sails.log.error(err);
							res.serverError();
						} else
							res.send('vote successfully updated');
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
						} else
							res.send('vote successfully created');
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
			});
			
			res.render('home', { user: req.session.user, posts: posts });
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
				
				console.log('new post:');
				console.log(post);
				
				res.redirect('/');
			});

		} else {
			res.notFound();
		}
	}
	
};