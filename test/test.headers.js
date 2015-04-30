/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	getHeaders = require( './../lib/headers.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'headers', function tests() {

	it( 'should export a function', function test() {
		expect( getHeaders ).to.be.a( 'function' );
	});

	it( 'should return an object', function test() {
		var headers = getHeaders( {} );
		assert.isObject( headers );
		assert.property( headers, 'date' );
		assert.property( headers, 'content-length' );
		assert.property( headers, 'status' );
	});

});
