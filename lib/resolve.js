'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-get:resolve' );
var parseHeader = require( 'parse-link-header' );
var request = require( './request.js' );
var flatten = require( './flatten.js' );
var getOptions = require( './options.js' );
var urlpath = require( './path.js' );
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
	var options;

	// Assemble request options:
	options = getOptions( opts );

	// TODO: determine if need to follow link-headers
	// TODO: if link-headers, need to parse and issue follow up requests (concurrent)
	// TODO: if multiple requests, concatenate all results into an object array
	// TODO: return results and rate limit info
	// TODO: instrument with logging

	/**
	* FUNCTION: getPage( i )
	*	Gets a resource page.
	*
	* @private
	* @param {Number} i - page number
	* @returns {Void}
	*/
	function getPage( i ) {
		var path;

		path = urlpath({
			'pathname': opts.pathname,
			'page': i,
			'per_page': opts.per_page
		});
		debug( 'Request path: %s', path );
	}
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;