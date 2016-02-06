'use strict';

// MODULES //

var tape = require( 'tape' );
var copy = require( 'utils-copy' );
var checklimit = require( './../lib/checklimit.js' );


// FUNCTIONS //

function setup() {
	return {
		'limit': 5000,
		'remaining': 4995,
		'reset': Date.now()
	};
}


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof checklimit, 'function', 'main export is a function' );
	t.end();
});

tape( 'if a header contains an old reset time, the function does nothing', function test( t ) {
	var ratelimit;
	var expected;
	var headers;

	ratelimit = setup();

	headers = {
		'x-ratelimit-reset': (ratelimit.reset-100).toString(),
		'x-ratelimit-remaining': '4990',
		'x-ratelimit-limit': '5000'
	};

	expected = copy( ratelimit );
	checklimit( ratelimit, headers );

	t.deepEqual( ratelimit, expected, 'does not update rate limit information' );
	t.end();
});

tape( 'if provided a header containing a new reset time, the function will update both the reset time and the remaining request limit', function test( t ) {
	var ratelimit;
	var expected;
	var headers;

	ratelimit = setup();

	headers = {
		'x-ratelimit-reset': (ratelimit.reset+100).toString(),
		'x-ratelimit-remaining': '4999',
		'x-ratelimit-limit': '5000'
	};

	expected = copy( ratelimit );
	expected.remaining = +headers[ 'x-ratelimit-remaining' ];
	expected.reset = +headers[ 'x-ratelimit-reset' ];

	checklimit( ratelimit, headers );
	t.deepEqual( ratelimit, expected, 'updates the reset time and remaining request limit' );
	t.end();
});

tape( 'if the reset time is the same and the header indicates fewer remaining request, the function will update the number of remaining requests', function test( t ) {
	var ratelimit;
	var expected;
	var headers;

	ratelimit = setup();

	headers = {
		'x-ratelimit-reset': ratelimit.reset.toString(),
		'x-ratelimit-remaining': '4990',
		'x-ratelimit-limit': '5000'
	};

	expected = copy( ratelimit );
	expected.remaining = +headers[ 'x-ratelimit-remaining' ];

	checklimit( ratelimit, headers );

	t.deepEqual( ratelimit, expected, 'updates the number of remaining requests' );
	t.end();
});

tape( 'if a header contains an outdated remaining limit (e.g., due to a request arriving out-of-order), the function does nothing', function test( t ) {
	var ratelimit;
	var expected;
	var headers;

	ratelimit = setup();

	headers = {
		'x-ratelimit-reset': ratelimit.reset.toString(),
		'x-ratelimit-remaining': (ratelimit.remaining+2).toString(),
		'x-ratelimit-limit': '5000'
	};

	expected = copy( ratelimit );

	checklimit( ratelimit, headers );

	t.deepEqual( ratelimit, expected, 'does not update rate limit information' );
	t.end();
});
