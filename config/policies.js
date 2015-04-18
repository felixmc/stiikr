/**
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 */

module.exports.policies = {

	'*': [ 'passport', /* your auth dependant policies go here */ ]
  
	// '*': true,

};
