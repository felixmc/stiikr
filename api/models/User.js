var User = {
  connection: 'mongo',
	schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
		posts     : { collection: 'Post', via: 'author' }
  }
};

module.exports = User;
