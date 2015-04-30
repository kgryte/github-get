/* global require, describe, it, beforeEach */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Deep copy:
	copy = require( 'utils-copy' ),

	// Module to be tested:
	checklimit = require( './../lib/checklimit.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'check rate limit headers', function tests() {

	var ratelimit;

	beforeEach( function before() {
		ratelimit = {
			'limit': 5000,
			'remaining': 4995,
			'reset': Date.now()
		};
	});

	it( 'should export a function', function test() {
		expect( checklimit ).to.be.a( 'function' );
	});

	it( 'should do nothing if a header contains an old reset time', function test() {
		var headers, expected;

		headers = {
			'x-ratelimit-reset': (ratelimit.reset-100).toString(),
			'x-ratelimit-remaining': '4990',
			'x-ratelimit-limit': '5000'
		};

		expected = copy( ratelimit );
		checklimit( ratelimit, headers );

		assert.deepEqual( ratelimit, expected );
	});

	it( 'should update both the reset time and the remaining request limit if provided a header containing a new reset time', function test() {
		var headers, expected;

		headers = {
			'x-ratelimit-reset': (ratelimit.reset+100).toString(),
			'x-ratelimit-remaining': '4999',
			'x-ratelimit-limit': '5000'
		};

		expected = copy( ratelimit );
		expected.remaining = +headers[ 'x-ratelimit-remaining' ];
		expected.reset = +headers[ 'x-ratelimit-reset' ];

		checklimit( ratelimit, headers );
		assert.deepEqual( ratelimit, expected );
	});

	it( 'should update the number of remaining requests if the reset time is the same and a header indicates fewer remaining requests', function test() {
		var headers, expected;

		headers = {
			'x-ratelimit-reset': ratelimit.reset.toString(),
			'x-ratelimit-remaining': '4990',
			'x-ratelimit-limit': '5000'
		};

		expected = copy( ratelimit );
		expected.remaining = +headers[ 'x-ratelimit-remaining' ];

		checklimit( ratelimit, headers );

		assert.deepEqual( ratelimit, expected );
	});

});
