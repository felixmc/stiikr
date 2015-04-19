var Vote = {
	conenction: 'mongo',
	schema: true,
	
	attributes: {
		value: {
			type: 'integer'
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