'use strict';

// MODULES //

var query = require( './query.js' );


// POLL //

/**
* FUNCTION: poll( ctx )
*	Encloses a context and returns a callback to be invoked by `setInterval`.
*
* @param {Object} ctx - function context
* @returns {Function} callback to be invoked by `setInterval`
*/
function poll( ctx ) {
	var qs = ctx._opts.qs,
		page = qs.page;
	/**
	* FUNCTION: poll()
	*	Callback invoked by `setInterval` in order to poll a Github API endpoint.
	*
	* @private
	*/
	return function poll() {
		// Ensure that the initial query page is the same for each query:
		qs.page = page;

		// Query a Github API endpoint:
		query.call( ctx );
	}; // end FUNCTION poll()
} // end FUNCTION poll()


// EXPORTS //

module.exports = poll;
