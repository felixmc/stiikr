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
		},
		
		score: function() {
			return _.reduceRight(this.votes, function(sum, next) {
				return sum + next.value;
			}, 0);
		}
		
	}
	
};

module.exports = Post;