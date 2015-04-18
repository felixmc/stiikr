
// Main Controller
module.exports = {

	index: function(req, res) {
	
		res.render('home', { user: req.session.user });
	}
	
};