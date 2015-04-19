var Vote = {
	conenction: 'mongo',
	schema: true,
	
	attributes: {
		value: {
		
		},
		user: {
			model: 'User',
			required: true
		},
		post: {
			model: 'Post',
			required: true
		}
		
	}
};

module.exports = Vote;