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
	var total;
	var data;

	// Assemble request options:
	options = getOptions( opts );

	// Initialize a response counter:
	count = 0;

	// Initialize an expected response total:
	total = 1;

	// Get an initial page:
	getPage( opts.page );

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
		var link;
		var last;
		var curr;
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
		// If a user wants multiple pages, we need to parse the link header...
		if (
			opts.last_page > opts.page ||
			opts.last_page === 'last'
		) {
			link = parseHeader( response.headers.link );
		}
		// If we have a link header, we have paginated results...
		if ( link ) {
			// Is this the first paginated response? If so, we need to initialize a data array and submit follow-up requests to retrieve additional pages...
			if ( data === void 0 ) {
				last = +link.last.page;
				if ( 
					opts.last_page === 'last' ||
					opts.last_page > last
				) {
					total = last;
				} else {
					total = opts.last_page;
				}
				data = new Array( total );
			}
			// Determine the current page number...
			if ( link.hasOwnProperty( 'next' ) ) {
				curr = +link.next.page - 1;
			} else {
				curr = +link.prev.page + 1;
			}
			// Cache the page results:
			data[ curr-1 ] = body;

			// If this is the first paged response, get the remaining pages...
			if ( curr === opts.page ) {
				return getPages( curr+1, total );
			}
		}
	} // end FUNCTION onPage()
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;