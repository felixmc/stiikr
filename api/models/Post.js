// Post Entity
module.exports = {

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