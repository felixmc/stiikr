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

			if (post.length) {
				post = post[0];

				function updatePost() {
					post.calculateScore();
					Post.update(post.id, post).exec(function(err, post) {
						if (err) sails.log.error(err);
					});
				}

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

// Main Controller
module.exports = {

	index: function(req, res) {
//		Post.getWinner(new Date(new Date().getTime() - (86400 * 1000 * 4) ), function(err, winners) {
//			if (err)
//				app.logger.error(err.stack);
//
//			console.log(winners);
//		});

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
		.paginate({ page: req.params('page') || 0, limit: 20 })
		.exec(function(err, posts) {
			if (err)
				sails.log.error(err);

			_.each(posts, function(post) {
//				post.calculateScore();
				post.createdAtISO = post.createdAt.toISOString();
				post.stale = post.isStale();
				post.preview = true;

				if (req.session.authenticated) {
					var userVote = _.find(post.votes, { user: req.session.user.id });
					if (userVote && userVote.value != 0) {
						post.locked = userVote.isLocked;
						post[userVote.value > 0 ? 'upvote' : 'downvote'] = true;
					}
				}
			});

			var data = { user: req.session.user, posts: posts, todaySelected: true };

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
			} else if (post) {
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

				res.render('post', post);
			} else {
				res.notFound();
			}
		});
	},

	wall: function(req, res) {
//		Post.find
		res.send('wall goes here');
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
