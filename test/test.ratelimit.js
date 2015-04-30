/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	ratelimit = require( './../lib/ratelimit.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'rate limit headers', function tests() {

	it( 'should export a function', function test() {
		expect( ratelimit ).to.be.a( 'function' );
	});

	it( 'should return an object', function test() {
		var headers = ratelimit( {} );
		assert.isObject( headers );
		assert.property( headers, 'limit' );
		assert.property( headers, 'remaining' );
		assert.property( headers, 'reset' );
	});

});
