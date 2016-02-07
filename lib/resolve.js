'use strict';

// MODULES //

var parseHeader = require( 'parse-link-header' );
var request = require( './request.js' );
var flatten = require( './flatten.js' );
var getRateLimit = require( './ratelimit.js' );
var checkRateLimit = require( './checklimit.js' );


// RESOLVE //

/**
* FUNCTION: resolve( opts, clbk )
*	Resolves endpoint resources.
*
* @param {Object} opts - request options
* @param {Function} clbk - callback to invoke after resolving resources
* @returns {Void}
*/
function resolve( opts, clbk ) {
	// TODO: assemble request headers
	// TODO: assemble request options
	// TODO: determine if need to follow link-headers
	// TODO: if link-headers, need to parse and issue follow up requests (concurrent)
	// TODO: if multiple requests, concatenate all results into an object array
	// TODO: return results and rate limit info
	// TODO: instrument with logging
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;