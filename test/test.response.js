/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	response = require( './../lib/response.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'response', function tests() {

	it( 'should export a function', function test() {
		expect( response ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		var onResponse = response( 0, 0, function() {} );
		assert.isFunction( onResponse );
	});

	it( 'should return a request error', function test( done ) {
		var onResponse, res;

		res = {};

		onResponse = response( 0, 0, clbk );
		onResponse( new Error( 'beep' ), res );

		function clbk( err ) {
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should return an error if the response status is not 200', function test( done ) {
		var onResponse, res;

		res = {
			'statusCode': 404
		};

		onResponse = response( 0, 0, clbk );
		onResponse( null, res );

		function clbk( err ) {
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should return an error if unable to parse the response body as JSON', function test( done ) {
		var onResponse, res, body;

		res = {
			'statusCode': 200
		};

		body = '[{"beep:"boop"}]';

		onResponse = response( 0, 0, clbk );
		onResponse( null, res, body );

		function clbk( err ) {
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should return headers and an event object', function test( done ) {
		var onResponse, res, body, expected;

		res = {
			'statusCode': 200,
			'headers': {
				'a': 'b'
			}
		};

		body = '[{"beep":"boop"}]';
		expected = [
			{'beep': 'boop'}
		];

		onResponse = response( 0, 0, clbk );
		onResponse( null, res, body );

		function clbk( err, headers, evt ) {
			if ( err ) {
				assert.ok( false );
			} else {
				assert.ok( true );
			}
			assert.isObject( headers );
			assert.strictEqual( headers, res.headers );

			assert.isObject( evt );
			assert.deepEqual( evt.data, expected );

			done();
		}
	});

});
