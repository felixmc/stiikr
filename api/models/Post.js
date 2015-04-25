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

		calculateScore: function () {
			this.score = _.reduceRight(this.votes, function (sum, next) {
				return sum + next.value;
			}, 0);
			return this.score;
		}

	},

	getWinner: function (date, callback) {
		console.log(new Date(date.getYear(), date.getMonth(), date.getDay()));
		console.log(new Date(date.getYear(), date.getMonth(), date.getDay() + 1));

		this.find({
			createdAt: {
				'>=': new Date(date.getYear(), date.getMonth(), date.getDay()),
				'<': new Date(date.getYear(), date.getMonth(), date.getDay() + 1)
			}, isWinner: true
		})
		.populate('votes')
		.exec(function(err, posts) {
			if (err) return callback(err, undefined);
			else if (posts) {
				console.log('day winner posts: ');
				console.log(posts);

				callback(undefined, posts);
			} else {
				this.find({
					createdAt: {
						'>=': new Date(date.getYear(), date.getMonth(), date.getDay()),
						'<': new Date(date.getYear(), date.getMonth(), date.getDay() + 1)
					}
				})
				.populate('votes')
				.exec(function(err, posts) {
					console.log('day posts: ');
					console.log(posts);

					if (err) return callback(err, undefined);
					else {
						var maxScore = _.reduce(posts, function (cur, post) {
							post.score = post.calculateScore();
							return Math.max(cur, post.score);
						}, 0);

						var winners = _.filter(posts, function (post) {
							return post.score == maxScore;
						});

						_.forEach(winners, function(winner) {
							winner.isWinner = true;
							this.update(winner.id, { isWinner: true }, function(err, post) {
								console.log(winner.id + ' marked as winner.');
							});
						});

						callback(undefined, winners);
					}
				});
			}
		});
	}

};

module.exports = Post;
