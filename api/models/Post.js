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

		score: {
			type: 'integer',
			required: false,
			defaultsTo: 0
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
		},

		isStale: function() {
			return new Date(this.createdAt).toDateString() !== new Date().toDateString();
			console.log();
		},

		url: function() {
			return 'http://stiikr.com/post/' + this.id;
		}

	},

	findWinner: function (date, callback) {
		var Self = this;

		var createdAt = {
			'>=': new Date(new Date(date).setHours(0,0,0,0)),
			'<':  new Date(new Date(date).setHours(24,0,0,0))
		};

		Self.find({
			createdAt: createdAt, isWinner: true
		}).populate('author').exec(function(err, posts) {
			if (err) return callback(err, null);
			else if (posts.length > 0) {
//				console.log('day winner posts: ');
//				console.log(posts);

				callback(null, posts);
			} else {
				Self.find({ createdAt: createdAt })
				.populate('author')
				.sort({ score: 'desc' })
				.exec(function(err, posts) {
					if (err) return callback(err, null);
					else {
						var maxScore = posts.length ? posts[0].score : 0;

//						_.reduce(posts, function (cur, post) {
//							post.score = post.calculateScore();
//							return Math.max(cur, post.score);
//						}, 0);

						var winners = _.filter(posts, function (post) {
							return post.score == maxScore;
						});

						_.forEach(winners, function(winner) {
							winner.isWinner = true;
							Self.update(winner.id, { isWinner: true }, function(err, post) {
//								console.log(winner.id + ' marked as winner.');
							});
						});

						callback(null, winners);
					}
				});
			}
		});
	}

};

module.exports = Post;
