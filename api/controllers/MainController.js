
// Main Controller
module.exports = {

	index: function(req, res) {
		Post.find({ limit: 10, sort: 'createdAt DESC' })
		.populate('author')
		.exec(function(err, posts) {
			if (err)
				sails.logger.error(err);
			
			res.render('home', { user: req.session.user, posts: posts });
		});
	},
	
	upvote: function(req, res) {
		if (req.method === 'POST' || req.session.authenticated) {
			Post.find( req.param('id') )
			.populate('votes')
			.exec(function(err, post) {
				if (err)
					sails.logger.error(err);

				if (post) {
					var vote = _.find(post.votes, { user: req.session.user.id });

					if (vote) {
						Vote.update(vote.id, { value: vote.value == 1 ? 0 : 1 })
						.exec(function(err, vote) {
							if (err) {
								sails.logger.error(err);
								res.serverError();
							} else
								res.send('vote successfully updated');
						});
					} else {
						Vote.create({
							user:  req.session.user.id,
							post:  post.id,
							value: 1
						}).exec(function(err, vote) {
							if (err) {
								sails.logger.error(err);
								res.serverError();
							} else
								res.send('new vote successful');
						});
					}
				} else {
					res.notFound();			
				}
			});
			
		} else {
			res.notFound();
		}
	},
	
	downvote: function(req, res) {
	
	}, 
	
	new: function(req, res) {
		if (req.method === 'POST' && req.session.authenticated) {
			Post.create({
				title:   req.param('title'),
				content: req.param('desc'),
				author:  req.session.user.id
			}).exec(function(err, post) {
				if (err)
					sails.logger.error(err);
				
				console.log('new post:');
				console.log(post);
				
				res.redirect('/');
			});

		} else {
			res.notFound();
		}
	}
	
};