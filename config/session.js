/**
 * Session Configuration
 * (sails.config.session)
 *
 * Sails session integration leans heavily on the great work already done by
 * Express, but also unifies Socket.io with the Connect session store. It uses
 * Connect's cookie parser to normalize configuration differences between Express
 * and Socket.io and hooks into Sails' middleware interpreter to allow you to access
 * and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.session.html
 */

module.exports.session = {

  secret: 'a940078cbfd9a914ab138613cb9aaffd',

	rolling:  true,
	resave:   false,
	proxy:    true,
	saveUnitialized: false,

	cookie: {
		maxAge: 24 * 60 * 60 * 1000,
		httpOnly: true
		//secure:   true,
	},

	adapter:  'redis',
//	hostname: repi.config.persistence.redis.hostname,
//	port:     repi.config.persistence.redis.port


  // host: 'localhost',
  // port: 6379,
  // ttl: <redis session TTL in seconds>,
  // db: 0,
  // pass: <redis auth password>,
  // prefix: 'sess:',


};