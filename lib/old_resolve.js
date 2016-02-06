'use strict';

// MODULES //

var request = require( 'request' );
var parseHeader = require( 'parse-link-header' );
var flatten = require( './flatten.js' );
var response = require( './response.js' );
var getRateLimit = require( './ratelimit.js' );
var checkRateLimit = require( './checklimit.js' );


// QUERY //

/**
* FUNCTION: query( ctx )
*	Makes one or more HTTP requests to the Github API and return the results as a JSON array.
*
* @private
* @param {Request} ctx - query context
* @returns {Void}
*/
function query( ctx ) {
	var getAll = ctx._getAll;
	var opts = ctx._opts;
	var count = 0;
	var ratelimit;
	var total;
	var data;

	// Start making queries:
	getPages();

	/**
	* FUNCTION: getPages( [next, last] )
	*	Queries the Github API.
	*
	* @private
	* @param {Number} [next] - the next page to fetch
	* @param {Number} [last] - the last page to fetch
	* @returns {Void}
	*/
	function getPages( i, j ) {
		var clbk;
		if ( i === void 0 ) {
			i = 0;
			j = 0;
		}
		for ( ; i <= j; i++ ) {
			opts.qs.page = i;
			clbk = response( i, onPage );
			request( opts, clbk );
		}
	} // end FUNCTION getPages()

	/**
	* FUNCTION: onPage( error, headers, evt )
	*	Callback invoked upon response an HTTP response.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Object} headers - HTTP response headers
	* @param {Object} evt - response data
	*/
	function onPage( error, headers, evt ) {
		var curr, link;

		count += 1;
		if ( count === 1 ) {
			// Get the rate limit info:
			ratelimit = getRateLimit( headers );
		} else {
			// Check if the rate limit info needs updating:
			checkRateLimit( ratelimit, headers );
		}
		// Did the request error?
		if ( error ) {
			self.emit( 'error', error );
		}
		// If the user wants all pages, we need to parse the link header...
		else if ( getAll ) {
			// Determine if we received a paginated result:
			link = parseHeader( headers.link );
		}
		// If we have a link header, we have paginated results...
		if ( link ) {
			// Is this the first paginated result? If so, initialize a data array and submit follow-up requests to retrieve the additional pages.
			if ( !data ) {
				total = +link.last.page;
				data = new Array( total );
			}
			// Determine the current page number...
			if ( link.hasOwnProperty( 'next' ) ) {
				curr = +link.next.page - 1;
			} else {
				curr = +link.prev.page + 1;
			}
			// Cache the page results:
			data[ curr-1 ] = evt.data;

			// Get the remaining pages...
			if ( curr === 1 ) {
				return getPages( curr+1, total );
			}
		}
		// Handle three cases: 1) user does not want to get all pages (total never set); 2) only one page exists (no link header present => link=null); 3) received an error response on the first request (link and total never set).
		else if ( !total ) {
			total = 1;
			data = ( evt ) ? evt.data : null;
		}
		// Have we received all responses?
		if ( count === total ) {
			if ( total > 1 ) {
				data = flatten( data );
			}
			if ( data ) {
				self.emit( 'data', data );
			}
			self.emit( 'end', {
				'ratelimit': ratelimit
			});
		}
	} // end FUNCTION onPage()
} // end FUNCTION query()


// EXPORTS //

module.exports = query;
