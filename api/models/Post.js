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

		isLocked: {
			type: 'boolean',
			required: false
		},

		isWinner: {
			type: 'boolean',
			required: false
		},

		calculateScore: function() {
			this.score = _.reduceRight(this.votes, function(sum, next) {
				return sum + next.value;
			}, 0);
			return this.score;
		}

	},

	staticTest: function() {
		Post.find( req.param('id') )
		.populate('votes')
		.exec(function(err, post) {
			if (err) console.log('ERRR');

			console.log(posts);

		}
	}

};

module.exports = Post;
