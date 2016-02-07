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
	var eFLG;

	// Assemble request options:
	options = getOptions( opts );

	// Initialize a response counter:
	count = 0;

	// Get an initial page:
	debug( 'Beginning request.' );
	getPage( opts.page );

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

		debug( 'Attempting to resolve page %d.', i );
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
		var curr;

		// TODO: FLG: If a previous query failed, bail...
		if ( eFLG ) {
			debug( 'Previous query failure. Will not process response.' );
			return;
		}
		if ( arguments.length === 1 ) {
			debug( 'No available rate limit information.' );
			eFLG = true;
			return clbk( error );
		}
		count += 1;

		// If this is the first response, get initial rate limit info; else, see if we need to update the rate limit info...
		if ( count === 1 ) {
			ratelimit = getRateLimit( response.headers );
		} else {
			checkRateLimit( ratelimit, response.headers );
		}
		// TODO: FLG
		if ( error ) {
			return clbk( error, null, ratelimit );
		}
		// If a user wants multiple pages, we need to parse the link header...
		if (
			opts.last_page > opts.page ||
			opts.last_page === 'last'
		) {
			debug( 'Multi-page response desired. Attempting to parse link header: %s', response.headers.link );
			link = parseHeader( response.headers.link );
		}
		// If we have a link header, we have a paginated response...
		if ( link ) {
			debug( 'Parsed link header: %s', JSON.stringify( link ) );

			if ( data === void 0 ) {
				init( +link.last.page );
			}
			if ( link.hasOwnProperty( 'next' ) ) {
				curr = +link.next.page - 1;
			} else {
				curr = +link.prev.page + 1;
			}
			debug( 'Current page: %d.', curr );

			debug( 'Caching page results.' );
			data[ curr-1 ] = body;

			if ( curr === opts.page ) {
				debug( 'First paginated result. Resolving %d remaining pages.', total-count );
				return getPages( curr+1, total );
			}
		} else {
			debug( 'No link header.' );

			// Handle two cases: 1) user does not want multiple pages; 2) only one page exists (no link header => link=null).
			if ( total === void 0 ) {
				total = 1;
				data = body;
			}
		}
		debug( '%d of %d pages resolved.', count, total );

		if ( count === total ) {
			return done();
		}
	} // end FUNCTION onPage()

	/**
	* FUNCTION: init( last )
	*	Determines how many pages to resolve and initializes an appropriately sized response cache.
	*
	* @private
	* @param {Number} last - last linked page
	* @returns {Void}
	*/
	function init( last ) {
		if ( 
			opts.last_page === 'last' ||
			opts.last_page > last
		) {
			total = last;
		} else {
			total = opts.last_page;
		}
		debug( 'Initializing response cache of size: %d.', total );
		data = new Array( total );
	} // end FUNCTION init()

	/**
	* FUNCTION: done()
	*	Callback invoked upon resolving all resources.
	*
	* @private
	* @returns {Void}
	*/
	function done() {
		debug( 'All resources successfully resolved.' );
		if ( total > 1 ) {
			debug( 'Flattening paginated results.' );
			data = flatten( data );
		}
		return clbk( null, data, ratelimit );
	} // end FUNCTION done()
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;