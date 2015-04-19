
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
				title: req.param('title'),
				content: req.param('description'),
				created: new Date(),
				author: req.session.passport
			}).exec(function(err, post) {
			
			});
			
			res.send("new");			
		} else {
			res.notFound();
		}

		

	}
	
};