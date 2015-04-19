
// Main Controller
module.exports = {

	index: function(req, res) {
	
//		console.log(req.session.user);

//		console.log(sails.views);
		
		Post.find({ limit: 10, sort: 'createdAt DESC' })
		.populate('author')
		.exec(function(err, posts) {
			if (err)
				sails.logger.error(err);
			
			res.render('home', { user: req.session.user, posts: posts });
		});

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