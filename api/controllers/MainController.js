
// Main Controller
module.exports = {

	index: function(req, res) {
	
//		console.log(req.session.user);

		res.render('home', { user: req.session.user });
	},
	
	new: function(req, res) {

		console.log(req.method);
		
		console.log(req.body);

		console.log(req.param('title'));
		
		if (req.method === 'POST' && req.authenticated) {
			res.send("new");			
		} else {
			res.notFound();
		}

		

	}
	
};