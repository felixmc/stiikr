var Vote = {
	connection: 'mongo',
	schema: true,

	attributes: {

		value: {
			type: 'integer',
			required: true
		},

		user: {
			model: 'User'
		},

		post: {
			model: 'Post'
		},

		isLocked: function() {
			return this.value != 0 && (
				(new Date().getTime() - new Date(this.updatedAt).getTime()) >= (60 * 10 * 1000)
			);
		}

	}
};

module.exports = Vote;
