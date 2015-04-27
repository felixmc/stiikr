var User = {
	connection: 'mongo',
	schema: true,

	attributes: {
		username  : { type: 'string', unique: true },
		email     : { type: 'email',  unique: true },
		photo     : { type: 'string', required: true },
		passports : { collection: 'Passport', via: 'user' },
		posts     : { collection: 'Post', via: 'author' },
		votes     : { collection: 'Vote', via: 'user' },
	},

	findLatestPosts: function(userId, callback) {
		Post.find({
			author: userId,
			createdAt: {
				'>': new Date(new Date() - (60 * 10 * 1000)),
			}
		}, callback);
	}
};

module.exports = User;
