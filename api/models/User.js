var User = {
	connection: 'mongo',
	schema: true,

	attributes: {
		username  : { type: 'string', unique: true },
		email     : { type: 'email',  unique: true },
		photo     : { type: 'string', required: true },
		passports : { collection: 'Passport', via: 'user' },
		posts     : { collection: 'Post', via: 'author' },
		votes     : { collection: 'Vote', via: 'user' }
	}
};

module.exports = User;
