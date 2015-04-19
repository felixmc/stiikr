
// Main Controller
module.exports = {

	index: function(req, res) {
	
//		console.log(req.session.user);

		res.render('home', { user: req.session.user });
	},
	
	new: function(req, res) {

		
		console.log(req.session);

		console.log(req.param('title'));
		
		if (req.method === 'POST' && req.authenticated) {

			Post.create({
				title:   req.param('title'),
				content: req.param('desc'),
				created: new Date(),
				author:  req.session.user.id
			}).exec(function(err, post) {
				if (err)
					sails.logger.error(err);
				
				console.log('new user:');
				console.log(user);
				
				res.redirect('/');
			});
			
			res.send("new");			
		} else {
			res.notFound();
		}

		

	}
	
};