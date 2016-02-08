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
	var err;

	// Assemble request options:
	options = getOptions( opts );

	count = 0;
	total = 1;

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
	* @param {Number} i - start page
	* @param {Number} j - end page
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

		count += 1;
		debug( '%d of %d pages resolved.', count, total );

		if ( arguments.length === 1 ) {
			debug( 'No available rate limit information.' );
			return done( error );
		}
		// If this is the first response, get initial rate limit info; otherwise, update rate limit info...
		if ( count === 1 ) {
			ratelimit = getRateLimit( response.headers );
		} else {
			ratelimit = checkRateLimit( ratelimit, response.headers );
		}
		if ( error ) {
			return done( error );
		}
		// If a user wants multiple pages, we need to parse the link header...
		if (
			opts.last_page > opts.page ||
			opts.last_page === 'last'
		) {
			debug( 'Attempting to parse link header: %s', response.headers.link );
			link = parseHeader( response.headers.link );
		}
		// Handle two cases: 1) user does not want multiple pages; 2) only one page exists (no link header => link=null)...
		if (
			link === void 0 || // single page
			link === null      // no link header
		) {
			debug( 'No link header.' );			
			data = body;
			return done();
		}
		// If we have a link header, we have a paginated response...
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
			debug( 'First paginated result. Resolving %d remaining page(s).', total-count );
			setTimeout( next( curr+1, total ), 0 ); // dezalgo'd
		}
		done();
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
	* FUNCTION: next( i, j )
	*	Returns a function to resolve the next pages.
	*
	* @private
	* @param {Number} i - start page
	* @param {Number} j - end page
	* @returns {Function} function to resolve next pages
	*/
	function next( i, j ) {
		/**
		* FUNCTION: next()
		*	Resolves the next set of pages.
		*
		* @private
		* @returns {Void}
		*/
		return function next() {
			getPages( i, j );
		};
	} // end FUNCTION next()

	/**
	* FUNCTION: done( [error] )
	*	Callback invoked upon resolving resources.
	*
	* @private
	* @param {Error} [error] - error object
	* @returns {Void}
	*/
	function done( error ) {
		if ( error && !err ) {
			err = error;
		}
		if ( count === total ) {
			debug( 'Request completed.' );
			if ( err ) {
				if ( ratelimit ) {
					return clbk( err, null, ratelimit );
				}
				return clbk( err );
			}
			if ( total > 1 ) {
				debug( 'Flattening paginated results.' );
				data = flatten( data );
				debug( 'Total number of results: %d', data.length );
			}
			return clbk( null, data, ratelimit );
		}
	} // end FUNCTION done()
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;