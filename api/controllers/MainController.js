
// Main Controller
module.exports = {

	index: function(req, res) {
	
//		console.log(req.session.user);
		
		res.render('home', { user: req.session.user });
	}
	
};