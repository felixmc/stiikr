
// Main Controller
module.exports = {

	index: function(req, res) {
	
//		console.log(req.session.user);

		console.log(sails.views);
		
		res.render('home', { user: req.session.user });
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
				
				console.log('new user:');
				console.log(user);
				
				res.redirect('/');
			});

		} else {
			res.notFound();
		}

		

	}
	
};