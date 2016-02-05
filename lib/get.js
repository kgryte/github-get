'use strict';

// MODULES //

var factory = require( './factory.js' );


// GET //

/**
* FUNCTION: get( options, clbk )
*	Requests resources from a Github API endpoint.
*
* @param {Object} options - function options
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Void}
*/
function get( options, clbk ) {
	factory( options, clbk )();
} // end FUNCTION get()


// EXPORTS //

module.exports = get;
