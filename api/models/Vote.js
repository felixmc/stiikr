var Vote = {
	connection: 'mongo',
	schema: true,
	
	attributes: {
		value: {
			type: 'integer',
			required: true
		},
		user: {
			model: 'User'
		},
		post: {
			model: 'Post'
		}
		
	}
};

module.exports = Vote;