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
			required: true
		},
		
		author: {
			model: 'User',
			required: true
		},
		
		votes: {
			collection: 'Vote',
			via: 'post'
		},
		
		calculateScore: function() {
			this.score = _.reduceRight(this.votes, function(sum, next) {
				return sum + next.value;
			}, 0);
			return this.score;
		}
		
	}
	
};

module.exports = Post;