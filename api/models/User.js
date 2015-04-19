var User = {
  connection: 'mongo',
	schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
		posts     : { collection: 'Post', via: 'author' },
		votes     : { collection: 'Vote', via: 'user' }
  }
};

module.exports = User;
