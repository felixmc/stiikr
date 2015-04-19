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
		
		calculateScore: function() {
			console.log('testing >> ');
			this.score = _.reduceRight(this.votes, function(sum, next) {
				console.log('testing >> ' + next);
				return sum + next.value;
			}, 0);
		}
		
	}
	
};

module.exports = Post;