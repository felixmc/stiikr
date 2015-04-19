// Post Entity
var Post = {
  connection: 'mongo',
	schema: true,
	
	attributes: {
		
		title: {
			type: 'string',
			required: true
		},
		
		content: {
			type: 'string',
			required: false
		},
		
		author: {
			model: 'User',
			required: true
		},
		
		votes: {
			collection: 'Vote',
			via: 'post'
		}
		
	}
	
};

module.exports = Post;