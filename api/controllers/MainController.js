
// Main Controller
module.exports = {

	index: function(req, res) {
	
//		console.log(req.session.user);

		console.log(sails.views);
		
		res.render('home', { user: req.session.user });
	},
	
	new: function(req, res) {


		
		console.log(req.session);

		
		
		if (req.method === 'POST' && req.session.authenticated) {

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