/**
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  '/': 'MainController',
  'post /new': 'MainController.new',
	'post /upvote/:id([0-9a-f]{24})': 'MainController.upvote',
	'post /downvote/:id([0-9a-f]{24})': 'MainController.downvote',	
	
	
	/* AUTH */
	'get /login': 'AuthController.login',
	'get /logout': 'AuthController.logout',
	'get /register': 'AuthController.register',

	'post /auth/local': 'AuthController.callback',
	'post /auth/local/:action': 'AuthController.callback',

	'get /auth/:provider': 'AuthController.provider',
	'get /auth/:provider/callback': 'AuthController.callback',
	'get /auth/:provider/:action': 'AuthController.callback'

};
