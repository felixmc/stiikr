'use strict';

function handleVote(req, res, voteValue) {
	if (req.method === 'POST' && req.session.authenticated) {
		Post.find( req.param('id') )
		.populate('votes')
		.exec(function(err, post) {
			if (err)
				sails.log.error(err);

			function cannotVote(message) {
				sails.log.debug('cannot vote: ' + message);
				res.status(403).send('can not vote: ' + message);
			}

			function updatePost() {
				post.calculateScore();
				Post.update(post.id, post).exec(function(err, post) {
					if (err) sails.log.error(err);
				});
			}

			if (post.length) {
				post = post[0];

				// if post is not from today..
				if (post.isStale())
					return cannotVote('post is stale');

				var vote = _.find(post.votes, { user: req.session.user.id });

				if (vote) {
					// check if vote is older than 10 minutes
					if (vote.isLocked())
						return cannotVote('vote is locked');

					var oldValue = vote.value;
					vote.value = vote.value == voteValue ? 0 : voteValue;
					Vote.update(vote.id, vote)
					.exec(function(err, newVote) {
						newVote = newVote[0];
						if (err) {
							sails.log.error(err);
							res.serverError();
						} else {
							req.socket.emit('voteUpdate', { post: post.id, score: post.calculateScore() + (newVote.value - vote.value) });
							updatePost();
							res.ok();
						}
					});
				} else {
					Vote.create({
						user:  req.session.user.id,
						post:  post.id,
						value: voteValue
					}).exec(function(err, newVote) {
						if (err) {
							sails.log.error(err);
							res.serverError();
						} else {
							req.socket.emit('voteUpdate', { post: post.id, score: post.calculateScore() + voteValue });
							post.votes.push(newVote);
							updatePost();
							res.ok();
						}
					});
				}
			} else {
				res.notFound();
			}
		});
	} else {
		res.notFound();
	}
}

function getPosts(page, user, callback) {
	Post.find({
		createdAt: {
			'>=': new Date(new Date().setHours(0,0,0,0)),
			'<':  new Date(new Date().setHours(24,0,0,0))
		},
		limit: 10,
		sort: 'createdAt DESC'
	}).populate('author')
	.populate('votes')
	.sort({ createdAt: 'desc' })
	.paginate({ page: page, limit: 20 })
	.exec(function(err, posts) {
		if (err)
			return callback(err, null);

		_.each(posts, function(post) {
			post.createdAtISO = post.createdAt.toISOString();
			post.stale = post.isStale();
			post.preview = true;

			if (user) {
				var userVote = _.find(post.votes, { user: user.id });
				if (userVote && userVote.value != 0) {
					post.locked = userVote.isLocked;
					post[userVote.value > 0 ? 'upvote' : 'downvote'] = true;
				}
			}
		});

		callback(null, posts);
	});
}

// Main Controller
module.exports = {

	index: function(req, res) {
		getPosts(req.param('page') || 0, req.user, function(err, posts) {
			if (err) {
				sails.log.error(err);
				res.serverError(err);
			} else {
				var data = { user: req.session.user, posts: posts, todaySelected: true, title: 'Home' };

				if (req.session.authenticated) {
					User.findLatestPosts(req.user.id, function(err, posts) {
						if (err) sails.log.error(err);
						else if (posts.length) {
							data.postLocked = true;
							data.postLockedTime = (((10 * 60 * 1000) - (new Date().getTime() - posts[0].createdAt.getTime())) / (60 * 1000)).toFixed(1);
						}
						res.render('home', data);
					});
				} else {
					res.render('home', data);
				}
			}
		});
	},

	posts: function(req, res) {
		getPosts(req.param('page') || 0, req.user, function(err, posts) {
			if (err) {
				sails.log.error(err);
				res.serverError(err);
			} else {
				var data = { user: req.session.user, posts: posts, todaySelected: true };

				var data = { posts: posts, layout: null };

				res.render('posts', data);
			}
		});
	},

	post: function(req, res) {
		Post.find(req.param('id'))
		.populate('author')
		.populate('votes')
		.exec(function(err, post) {
			if (err) {
				sails.log.error(err);
				res.serverError();
			} else if (post.length) {
				post = post[0];
//				post.calculateScore();
				post.createdAtISO = post.createdAt.toISOString();
				post.stale = post.isStale();

				if (req.session.authenticated) {
					var userVote = _.find(post.votes, { user: req.session.user.id });
					if (userVote && userVote.value != 0) {
						post.locked = userVote.isLocked;
						post[userVote.value > 0 ? 'upvote' : 'downvote'] = true;
					}
				}

				res.render('post', { post: post, title: post.title });
			} else {
				res.notFound();
			}
		});
	},

	wall: function(req, res) {
		var data = { wallSelected: true, title: 'Wall' };

		var dates = [];

		var dayTime = 1000 * 60 * 60 * 24;
		var today   = new Date();//new Date().getTime() - dayTime);
		today.setHours(0,0,0,0);

		for (var i = 1; i < today.getDate(); i++) {
			dates.push(new Date(today.getTime() - (i * dayTime)));
		}

		async.map(dates, function(date, callback) {
			Post.findWinner(date, function(err, winner) {
				if (err) callback(err, null);
				else {
					callback(null, { date: { day: date.getDate(), month: DateService.month(date.getMonth()), year: date.getFullYear() }, winners: winner });
				}
			});
		}, function(err, winners) {
			if (err) sails.log.error(err.stack);
			else {
				data.timeline = winners;
				res.render('wall', data);
			}
		});
	},

	fixScores: function(req, res) {

		Post.find({})
		.populate('votes')
		.exec(function(err, posts) {
			if (err) sails.error(err.stack);

			async.each(posts, function(post, callback) {
				post.calculateScore();
				post.isWinner = false;
				Post.update(post.id, post, function(err, updatedPost) {
					if (err) callback(err);
					else callback(null);
				});
			}, function(err) {
				if (err) sails.error(err.stack);
				res.send('Posts updated!\n' + (err ? 'With errors: ' + err : 'No Errors.'));
			});
		});

	},

	upvote: function(req, res) {
		handleVote(req, res, 1);
	},

	downvote: function(req, res) {
		handleVote(req, res, -1);
	},

	new: function(req, res) {
		if (req.method === 'POST' && req.session.authenticated) {
			Post.create({
				title:   req.param('title'),
				content: req.param('desc'),
				author:  req.session.user.id
			}).exec(function(err, post) {
				if (err)
					sails.log.error(err);

				res.redirect('/');
			});
		} else {
			res.notFound();
		}
	}

};
