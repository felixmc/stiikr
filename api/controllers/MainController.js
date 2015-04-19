
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
			
				var hasVote = _.contains(post.votes, { user: req.session.user.id });
				
//				post.votes.
				
				console.log('userid: ' + req.session.user.id);
				console.log(post);
				
				res.send('success');
			} else {
				res.notFound();			
			}
		});
			
			// if user has vote for post
				// if vote value is same, set vote value to 0
				// else if value is different, change vote value
			// else create vote for post with value 1
			
			
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