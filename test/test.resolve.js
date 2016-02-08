'use strict';

// MODULES //

var tape = require( 'tape' );
var round = require( 'math-round' );
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

function headers() {
	return {
		'x-ratelimit-limit': 5000,
		'x-ratelimit-remaining': 4999,
		'x-ratelimit-reset': round( Date.now()/1000 )
	};
}

function request( error, headers, body ) {
	if ( arguments.length === 1 ) {
		return req1;
	}
	return req2;

	function req1( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			clbk( error );
		}
	}
	function req2( opts, clbk ) {
		setTimeout( onTimeout, 0 );
		function onTimeout() {
			var res = {};
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
	t.ok( false );
	t.end();
});

tape( 'if a paginated request encounters an application error, the error is returned to the provided callback with rate limit information', function test( t ) {
	// e.g., network goes down after initial request
	t.ok( false );
	t.end();
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