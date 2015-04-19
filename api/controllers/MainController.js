
// Main Controller
module.exports = {

	index: function(req, res) {
	
//		console.log(req.session.user);

		res.render('home', { user: req.session.user });
	},
	
	new: function(req, res) {

		console.log(req.method);
		
		console.log(req.body);
		
		res.send("new");
	}
	
};