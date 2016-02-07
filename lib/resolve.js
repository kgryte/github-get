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
	var ratelimit;
	var options;
	var count;

	// Assemble request options:
	options = getOptions( opts );

	// Initialize a response counter:
	count = 0;

	// TODO: determine if need to follow link-headers
	// TODO: if link-headers, need to parse and issue follow up requests (concurrent)
	// TODO: if multiple requests, concatenate all results into an object array
	// TODO: return results and rate limit info

	/**
	* FUNCTION: getPage( i )
	*	Gets a single resource page.
	*
	* @private
	* @param {Number} i - page number
	* @returns {Void}
	*/
	function getPage( i ) {
		options.path = urlpath({
			'pathname': opts.pathname,
			'page': i,
			'per_page': opts.per_page
		});
		debug( 'Request path: %s', options.path );

		request( options, onPage );
	} // end FUNCTION getPage()

	/**
	* FUNCTION: getPages( i, j )
	*	Gets multiple resource pages.
	*
	* @private
	* @param {Number} i - starting page number
	* @param {Number} j - ending page number
	* @returns {Void}
	*/
	function getPages( i, j ) {
		for ( ; i <= j; i++ ) {
			getPage( i );
		}
	} // end FUNCTION getPages()

	/**
	* FUNCTION: onPage( error, response, body )
	*	Callback invoked upon receiving an HTTP response.
	*
	* @private
	* @param {Error|Null} error - error or null
	* @param {Object} response - HTTP response object
	* @param {Object[]|Object} body - response body
	* @returns {Void}
	*/
	function onPage( error, response, body ) {
		if ( arguments.length === 1 ) {
			debug( 'No available rate limit information.' );
			return clbk( error );
		}
		count += 1;

		// If this is the first response, get initial rate limit info; else, see if we need to update the rate limit info...
		if ( count === 1 ) {
			ratelimit = getRateLimit( response.headers );
		} else {
			checkRateLimit( ratelimit, response.headers );
		}
		if ( error ) {
			return clbk( error, null, ratelimit );
		}
	} // end FUNCTION onPage()
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;