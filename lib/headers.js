'use strict';

/**
* FUNCTION: headers( opts )
*	Returns request headers based on provided options.
*
* @param {Object} opts - request options
* @returns {Object} request headers
*/
function headers( opts ) {
	var out = {};
	if ( opts.useragent ) {
		out[ 'User-Agent' ] = opts.useragent;
	}
	if ( opts.accept ) {
		out[ 'Accept' ] = opts.accept;
	}
	if ( opts.token ) {
		out[ 'Authorization' ] = 'token ' + opts.token;
	}
	return out;
} // end FUNCTION headers()


// EXPORTS //

module.exports = headers;