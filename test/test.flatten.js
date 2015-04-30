/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	flatten = require( './../lib/flatten.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flatten', function tests() {

	it( 'should export a function', function test() {
		expect( flatten ).to.be.a( 'function' );
	});

	it( 'should flatten an array of arrays', function test() {
		var arr, actual, expected;

		arr = [ [1,2],[3,4],[5,6] ];

		actual = flatten( arr );
		expected = [ 1, 2, 3, 4, 5, 6 ];

		assert.deepEqual( actual, expected );
	});

	it( 'should flatten an array which includes missing values', function test() {
		var arr, actual, expected;

		arr = new Array( 3 );
		arr[ 0 ] = [ 1, 2 ];
		arr[ 2 ] = [ 5, 6 ];

		actual = flatten( arr );
		expected = [ 1, 2, 5, 6 ];

		assert.deepEqual( actual, expected );
	});

});
