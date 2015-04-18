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
			type: 'string',
			required: true
		},
		
		'created': {
			type: 'date',
			required: true
		},
		
		'edited': {
			type: 'date',
			required: false
		}
		
		
	}
	
};

module.exports = Post;