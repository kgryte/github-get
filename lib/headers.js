'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-get:headers' );


// HEADERS //

/**
* FUNCTION: headers( opts )
*	Returns request headers based on provided options.
*
* @param {Object} opts - provided options
* @param {String} [opts.token] - Github access token
* @param {String} [opts.accept] - media type
* @param {String} [opts.useragent] - user agent string
* @returns {Object} request headers
*/
function headers( opts ) {
	var out = {};
	if ( opts.useragent ) {
		debug( 'User-Agent: %s', opts.useragent );
		out[ 'User-Agent' ] = opts.useragent;
	}
	if ( opts.accept ) {
		debug( 'Accept: %s', opts.accept );
		out[ 'Accept' ] = opts.accept;
	}
	if ( opts.token ) {
		out[ 'Authorization' ] = 'token ' + opts.token;
	}
	return out;
} // end FUNCTION headers()


// EXPORTS //

module.exports = headers;