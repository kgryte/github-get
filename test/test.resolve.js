'use strict';

// MODULES //

var tape = require( 'tape' );
var round = require( 'math-round' );
var isArray = require( 'validate.io-array' );
var proxyquire = require( 'proxyquire' );
var resolve = require( './../lib/resolve.js' );


// FUNCTIONS //

/**
* FUNCTION: options()
*	Returns mock request options.
*
* @private
* @returns {Object} mock request options
*/
function options() {
	return {
		'method': 'GET',
		'protocol': 'https',
		'hostname': 'api.beep.com',
		'port': 443,
		'pathname': '/api/v3/user/repos',
		'page': 1,
		'last_page': 1,
		'useragent': 'beepboopbop',
		'accept': 'application/vnd.github.v3+json',
		'token': 'abcdef123!'
	};
} // end FUNCTION options()

/**
* FUNCTION: headers()
*	Returns mock response headers.
*
* @private
* @returns {Object} mock response headers
*/
function headers() {
	return {
		'x-ratelimit-limit': '5000',
		'x-ratelimit-remaining': '4999',
		'x-ratelimit-reset': ( round( Date.now()/1000 ) ).toString()
	};
} // end FUNCTION headers()

/**
* FUNCTION: request( error[, headers, body] )
*	Returns a mock request function.
*
* @private
* @param {Error|Object|Null} error - an error object or null
* @param {Object|Null} headers - response headers or null
* @param {Object|Array|Null} body - response body or null
* @returns {Function} mock request
*/
function request( error, headers, body ) {
	if ( arguments.length === 1 ) {
		return req1;
	}
	return req2;

	function req1( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err;
			if ( error instanceof Error ) {
				err = {
					'status': 500,
					'message': error.message
				};
			} else {
				err = error;
			}
			clbk( err );
		}
	}
	function req2( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var err;
			var res;
			if ( error instanceof Error ) {
				err = {
					'status': 500,
					'message': error.message
				};
				return clbk( err );
			} else {
				err = error;
			}
			res = {};
			res.headers = headers;
			clbk( err, res, body );
		}
	}
} // end FUNCTION request()

/**
* FUNCTION: multirequest( args )
*	Returns a mock request function capable of being called multiple times, each time with different arguments.
*
* @private
* @param {Array[]} args - array of argument arrays
* @returns {Function} request mock capable of being called multiple times
*/
function multirequest( args ) {
	var reqs;
	var i;
	reqs = new Array( args.length );
	for ( i = 0; i < reqs.length; i++ ) {
		reqs[ i ] = request.apply( null, args[i] );
	}
	i = -1;
	return function multirequest( opts, clbk ) {
		i += 1;
		reqs[ i ]( opts, clbk ); 
	};
} // end FUNCTION multirequest()


// VARIABLES //

var link1 = '<https://api.github.com/user/9287/repos?page=2&per_page=100>; rel="next", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';

var link2 = '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="first", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", <https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';

var link3 = '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="first", <https://api.github.com/user/9287/repos?page=2&per_page=100>; rel="prev", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof resolve, 'function', 'main export is a function' );
	t.end();
});

tape( 'if an initial request encounters an application error, the error is returned to the provided callback', function test( t ) {
	var resolve;
	var mock;
	var err;

	err = new Error( 'ENOTFOUND' );

	mock = request( err );

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': mock
	});

	resolve( options(), done );

	function done( error ) {
		t.equal( error.status, 500, '500 status' );
		t.equal( error.message, err.message, 'equal message' );
		t.end();
	}
});

tape( 'if a paginated request encounters an application error (e.g., network goes down after an initial request), the error is returned to the provided callback with rate limit information', function test( t ) {
	var resolve;
	var mock;
	var opts;
	var args;
	var arr;

	args = [];

	// First request call:
	arr = new Array( 3 );
	arr[ 0 ] = null;
	arr[ 1 ] = headers();
	arr[ 1 ].link = link1;
	arr[ 1 ][ 'x-ratelimit-remaining' ] = '4999';
	arr[ 2 ] = {'beep':'boop'};
	args.push( arr );

	// Second request call:
	arr = new Array( 3 );
	arr[ 0 ] = new Error( 'ENOTFOUND' );
	arr[ 1 ] = null;
	arr[ 2 ] = null;
	args.push( arr );

	// Third request call:
	arr = new Array( 3 );
	arr[ 0 ] = null;
	arr[ 1 ] = headers();
	arr[ 1 ].link = link3;
	arr[ 1 ][ 'x-ratelimit-remaining' ] = '4998';
	arr[ 2 ] = {'boop':'beep'};
	args.push( arr );

	mock = multirequest( args );

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': mock
	});

	opts = options();

	// Set the `last_page` option to 'last' to instruct `resolve` to resolve multiple pages:
	opts.last_page = 'last';

	resolve( opts, done );

	function done( error, data, info ) {
		t.equal( error.status, 500, '500 status' );
		t.equal( error.message, args[1][0].message, 'equal message' );

		t.equal( data, null, 'no response data' );

		t.ok( info, 'has ratelimit info' );
		t.equal( info.remaining, +args[2][1][ 'x-ratelimit-remaining' ], 'equal rate limit remaining' );

		t.end();
	}
});

tape( 'for some downstream errors, the error is returned to the provided callback with rate limit information', function test( t ) {
	var resolve;
	var mock;
	var err;
	var h;

	err = {
		'status': 502,
		'message': 'unable to parse response as JSON'
	};

	h = headers();
	mock = request( err, h, null );

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': mock
	});

	resolve( options(), done );

	function done( error, data, info ) {
		t.equal( error.status, err.status, 'equal status' );
		t.equal( error.message, err.message, 'equal message' );

		t.equal( data, null, 'no response data' );

		t.ok( info, 'has rate limit info' );
		t.equal( info.remaining, +h[ 'x-ratelimit-remaining' ], 'equal rate limit remaining' );

		t.end();
	}
});

tape( 'for some downstream errors, rate limit information may not be available', function test( t ) {
	// e.g., corrupted response, Github service interruption, etc, where rate limit info headers are not set. Rate limit info values should be NaN.
	var resolve;
	var mock;
	var err;

	err = {
		'status': 503,
		'message': 'service down for maintenance'
	};

	mock = request( err, {}, null );

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': mock
	});

	resolve( options(), done );

	function done( error, data, info ) {
		t.equal( error.status, err.status, 'equal status' );
		t.equal( error.message, err.message, 'equal message' );

		t.equal( data, null, 'no response data' );

		console.log( info );
		t.ok( info, 'has rate limit info arg' );
		t.ok( info.remaining !== info.remaining, 'remaining is NaN' );
		t.ok( info.reset !== info.reset, 'reset is NaN' );
		t.ok( info.limit !== info.limit, 'limit is NaN' );

		t.end();
	}
});

tape( 'the function supports basic (non-paginated) requests', function test( t ) {
	// e.g., / => {...}
	t.ok( false );
	t.end();
});

tape( 'the function handles the case where a user wants multiple pages, but only a single page exists (no link header)', function test( t ) {
	t.ok( false );
	t.end();
});

tape( 'the function supports resolving multiple pages', function test( t ) {
	t.ok( false );
	t.end();
});

tape( 'the function supports resolving all pages', function test( t ) {
	t.ok( false );
	t.end();
});

tape( 'the function supports resolving an arbitrary subset of pages', function test( t ) {
	t.ok( false );
	t.end();
});

tape( 'if provided a `last_page` option exceeding the total number of available pages, the function ignores the option and only resolves the available pages', function test( t ) {
	t.ok( false );
	t.end();
});

tape( 'the function returns paginated results as a flat object array', function test( t ) {
	t.ok( false );
	t.end();
});

tape( 'the function returns rate limit information', function test( t ) {
	t.ok( false );
	t.end();
});