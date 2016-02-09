'use strict';

// MODULES //

var tape = require( 'tape' );
var round = require( 'math-round' );
var isArray = require( 'validate.io-array' );
var proxyquire = require( 'proxyquire' );
var resolve = require( './../lib/resolve.js' );


// FUNCTIONS //

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
}

// Mock HTTP response headers...
function headers() {
	return {
		'x-ratelimit-limit': 5000,
		'x-ratelimit-remaining': 4999,
		'x-ratelimit-reset': round( Date.now()/1000 )
	};
}

// Mock request with support for calling multiple times with different argument combinations...
function request( error, headers, body ) {
	var hincr;
	var bincr;
	var eincr;
	var hidx;
	var bidx;
	var eidx;
	var h;
	var b;
	var e;

	if ( arguments.length === 1 ) {
		return req1;
	}
	// Add support for the mock to be called multiple times...
	if ( !isArray( headers ) ) {
		h = [ headers ];
		hincr = false;
	} else {
		h = headers;
		hincr = true;
	}
	hidx = 0;
	if ( !isArray( body ) ) {
		b = [ body ];
		bincr = false;
	} else {
		b = body;
		bincr = true;
	}
	bidx = 0;
	if ( !isArray( error ) ) {
		e = [ error ];
		eincr = false;
	} else {
		e = error;
		eincr = true;
	}
	eidx = 0;

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
			var headers;
			var error;
			var body;
			var res;

			headers = h[ hidx ];
			body = b[ bidx ];

			if ( e[ eidx ] instanceof Error ) {
				error = {
					'status': 500,
					'message': e[ eidx ].message
				};
			} else {
				error = e[ eidx ];
			}

			if ( hincr ) {
				hidx += 1;
			}
			if ( bincr ) {
				bidx += 1;
			}
			if ( eincr ) {
				eidx += 1;
			}
			if (
				headers === null &&
				body === null
			) {
				return clbk( error );
			}
			res = {};
			res.headers = headers;
			
			clbk( error, res, body );
		}
	}
}


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
	var e1, e2, e3;
	var h1, h2, h3;
	var b1, b2, b3;

	// First request call:
	e1 = null;
	h1 = headers();
	h1.link = link1;
	h1[ 'x-ratelimit-remaining' ] = 4999;
	b1 = {'beep':'boop'};

	// Second request call:
	e2 = new Error( 'ENOTFOUND' );
	h2 = null;
	b2 = null;

	// Third request call:
	e3 = null;
	h3 = headers();
	h3.link = link3;
	h3[ 'x-ratelimit-remaining' ] = 4998;
	b3 = {'boop':'beep'};

	mock = request( [e1,e2,e3], [h1,h2,h3], [b1,b2,b3] );

	resolve = proxyquire( './../lib/resolve.js', {
		'./request.js': mock
	});

	opts = options();

	// Set the `last_page` option to 'last' to instruct `resolve` to resolve multiple pages:
	opts.last_page = 'last';

	resolve( opts, done );

	function done( error, data, info ) {
		t.equal( error.status, 500, '500 status' );
		t.equal( error.message, e2.message, 'equal message' );

		t.equal( data, null, 'no response data' );

		t.ok( info, 'has ratelimit info' );
		t.equal( info.remaining, h3[ 'x-ratelimit-remaining' ], 'equal rate limit remaining' );

		t.end();
	}
});

tape( 'for some downstream errors, the error is returned to the provided callback with rate limit information', function test( t ) {
	t.ok( false );
	t.end();
});

tape( 'for some downstream errors, rate limit information may not be available', function test( t ) {
	// e.g., corrupted response, Github service interruption, etc, where rate limit info headers are not set. Values should be NaN.
	t.ok( false );
	t.end();
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