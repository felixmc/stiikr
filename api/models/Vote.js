var Vote = {
	conenction: 'mongo',
	schema: true,
	
	attributes: {
		value: {
			type: 'integer',
			required: true
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