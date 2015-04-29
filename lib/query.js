'use strict';

// MODULES //

var request = require( 'request' ),
	parseHeader = require( 'parse-link-header' ),
	copy = require( 'utils-copy' ),
	flatten = require( './flatten.js' ),
	response = require( './response.js' ),
	getHeaders = require( './headers.js' ),
	getRateLimit = require( './ratelimit.js' );


// QUERY //

/**
* FUNCTION: query()
*	Makes one or more HTTP requests to the Github API and emits the results as a JSON array.
*
* @private
*/
function query() {
	/* jshint validthis:true */
	var self = this,
		getAll = this._getAll,
		opts = this._opts,
		count = 0,
		ratelimit,
		results,
		total,
		qid;

	// Create a unique query id:
	qid = ++this._qid;

	// Emit that we are ready to begin making requests:
	this.emit( 'init', {
		'qid': qid
	});

	// Start making requests:
	getPages();

	/**
	* FUNCTION: getPages( [next, last] )
	*	Makes request(s) to the Github API.
	*
	* @private
	* @param {Number} [next] - the next page to fetch
	* @param {Number} [last] - the last page to fetch
	*/
	function getPages( i, j ) {
		var req = {},
			clbk;

		req.qid = qid;
		if ( i === void 0 ) {
			i = 0;
			j = 0;
		}
		for ( ; i <= j; i++ ) {
			opts.qs.page = i;

			// Create a response handler:
			clbk = response( qid, i, onPage );

			// Emit that we are making a new request...
			req.options = copy( opts );
			req.time = Date.now();
			req.rid = i;
			self.emit( 'request', req );

			// Make the request:
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
		var data,
			curr,
			link,
			tmp;

		count += 1;
		data = evt.data;

		if ( count === 1 ) {
			// Get the current rate limit info:
			ratelimit = getRateLimit( headers );
		} else {
			tmp = +headers[ 'x-ratelimit-reset' ];
			// Account for the ratelimit being reset in the middle of a query...
			if ( tmp === tmp && ratelimit.reset !== tmp ) {
				ratelimit.reset = tmp;
			} else {
				// Account for responses arriving out-of-order (i.e., a response indicating a higher remaining ratelimit arriving after a response indicating a lower remaining limit)...
				tmp = +headers[ 'x-ratelimit-remaining' ];
				if ( tmp < ratelimit.remaining ) {
					ratelimit.remaining = tmp;
				}
			}
		}
		// Did the response error?
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
			// Is this the first paginated result? If so, initialize a results array and submit follow-up requests to retrieve the additional pages.
			if ( !results ) {
				total = +link.last.page;
				results = new Array( total );
			}
			// Determine the current page number...
			if ( link.hasOwnProperty( 'next' ) ) {
				curr = +link.next.page - 1;
			} else {
				curr = +link.prev.page + 1;
			}
			// Cache the results:
			results[ curr-1 ] = data;

			self.emit( 'page', {
				'qid': qid,
				'rid': evt.rid,
				'time': evt.time,
				'page': curr,
				'count': count,
				'total': total,
				'data': data,
				'headers': getHeaders( headers )
			});

			// Get the remaining pages...
			if ( curr === 1 ) {
				return getPages( curr+1, total );
			}
			// Empty the headers:
			headers = null;
		}
		// Handle three cases: 1) user does not want to get all pages (total never set); 2) only one page exists (no link header present => link=null); 3) received an error response on the first request (link and total never set).
		else if ( !total ) {
			total = 1;
			results = data;
			headers = getHeaders( headers );
		}
		// Have we received all responses?
		if ( count === total ) {
			if ( total > 1 ) {
				results = flatten( results );
			}
			if ( results ) {
				data = {
					'qid': qid,
					'time': evt.time,
					'data': results
				};
				if ( headers ) {
					data.headers = headers;
				}
				self.emit( 'data', data );
			}
			self.emit( 'end', {
				'qid': qid,
				'ratelimit': ratelimit
			});
		}
	} // end FUNCTION onPage()
} // end FUNCTION query()


// EXPORTS //

module.exports = query;
