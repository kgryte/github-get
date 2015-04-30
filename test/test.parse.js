/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	parse = require( './../lib/parse.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'parse', function tests() {

	it( 'should export a function', function test() {
		expect( parse ).to.be.a( 'function' );
	});

	it( 'should return an object if able to parse a JSON string', function test() {
		var actual, expected;

		actual = parse( '[{"beep":"boop"}]' );
		expected = [
			{'beep': 'boop'}
		];
		assert.isArray( actual );
		assert.deepEqual( actual, expected );
	});

	it( 'should return null if unable to parse a string as JSON', function tet() {
		var blob = parse( '[{"beep:"boop"}]' );
		assert.isNull( blob );
	});

});
