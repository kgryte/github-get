'use strict';

// MODULES //

var request = require( 'request' ),
	parseHeader = require( 'parse-link-header' ),
	merge = require( 'utils-merge2' )(),
	isObject = require( 'validate.io-object' ),
	isFunction = require( 'validate.io-function' ),
	isBoolean = require( 'validate.io-boolean-primitive' );


// VARIABLES //

var defaults = require( './defaults.json' );


// FUNCTIONS //

/**
* FUNCTION: parse( str )
*	Attempts to parse a string as JSON.
*
* @private
* @param {String} str - input string
* @returns {Object|Null} JSON object or null
*/
function parse( str ) {
	try {
		return JSON.parse( str );
	} catch ( err ) {
		return null;
	}
} // end FUNCTION parse()

/**
* FUNCTION: flatten( arr )
*	Flattens an array of arrays.
*
* @private
* @param {Array[]} arr - array of arrays
* @returns {Array} 1d array
*/
function flatten( arr ) {
	var len = arr.length,
		tmp,
		out,
		i, j;

	out = [];
	for ( i = 0; i < len; i++ ) {
		tmp = arr[ i ];
		for ( j = 0; j < tmp.length; j++ ) {
			out.push( tmp[ j ] );
		}
	}
	return out;
} // end FUNCTION flatten()


// REQUEST //

/**
* FUNCTION: get( opts, clbk )
*	Makes an HTTP request to the Github API and passes the results as a JSON array to the provided callback.
*
* @param {Object} opts - request options
* @param {Function} clbk - callback to invoke upon assembling the request results. The callback should accept two arguments: [ error, results ]. If no error is encountered during the request, error is `null`.
*/
function get( opts, clbk ) {
	var isFirst = true,
		getAll = false,
		results,
		total,
		count;

	if ( !isObject( opts ) ) {
		throw new TypeError( 'get()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'get()::invalid input argument. Callback must be a function. Value: `' + clbk + '`.' );
	}
	opts = merge( {}, defaults, opts );
	if ( opts.hasOwnProperty( 'all' ) ) {
		getAll = opts.all;
		delete opts.all;
		if ( !isBoolean( getAll ) ) {
			throw new TypeError( 'get()::invalid option. `all` option must be a boolean primitive. Option: `' + getAll + '`.' );
		}
	}
	opts.method = 'GET';

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
		if ( !arguments.length ) {
			request( opts, onPage );
		} else {
			for ( ; i <= j; i++ ) {
				opts.qs.page = i;
				request( opts, onPage );
			}
		}
	} // end FUNCTION getPages()

	/**
	* FUNCTION: onPage( error, response, body )
	*	Callback invoked upon receiving an HTTP response.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Object} response - HTTP response object
	* @param {String} body - response body
	*/
	function onPage( error, response, body ) {
		var curr,
			data,
			link,
			err;

		if ( error ) {
			err = {
				'status': 500,
				'message': 'Request error. Error encountered while attempting to query the Github API.',
				'detail': error
			};
			return clbk( err );
		}
		if ( response.statusCode !== 200 ) {
			err = {
				'status': response.statusCode,
				'message': 'Client error.',
				'detail': body
			};
			return clbk( err );
		}
		data = parse( body );
		if ( data === null ) {
			err = {
				'status': 502,
				'message': 'Unable to parse response body as JSON.',
				'detail': body
			};
			return clbk( err );
		}
		// Are we supposed to continue querying the Github API for additional results?
		if ( !getAll ) {
			return clbk( null, data );
		}
		// Determine if the response is paginated. If not, we are done. Otherwise, query the API to return the rest of the results.
		link = parseHeader( response.headers.link );
		if ( link === null ) {
			return clbk( null, data );
		}
		// Is this the first paginated result? If so, initialize a results array and submit follow-up requests to retrieve the additional pages.
		if ( isFirst ) {
			isFirst = false;
			total = +link.last.page;
			count = 1;

			results = new Array( total );
			results[ 0 ] = data;

			return getPages( +link.next.page, total );
		}
		if ( link.hasOwnProperty( 'next' ) ) {
			curr = +link.next.page - 1;
		} else {
			curr = +link.prev.page + 1;
		}
		results[ curr-1 ] = data;
		count += 1;

		// Have we received all requests? If so, flatten the results array and pass the flattened array to the callback.
		if ( count === total ) {
			clbk( null, flatten( results ) );
		}
	} // end FUNCTION onPage()
} // end FUNCTION get()


// EXPORTS //

module.exports = get;
