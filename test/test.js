/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module for intercepting HTTP requests:
	nock = require( 'nock' ),

	// Module to be tested:
	createQuery = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( '@kgryte/github-get', function tests() {

	it( 'should export a function', function test() {
		expect( createQuery ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			true,
			null,
			undefined,
			NaN,
			[],
			function(){}
		];
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				createQuery( value );
			};
		}
	});

	it( 'should throw an error if provided an `all` option which is not a boolean primitive', function test() {
		var values = [
			'5',
			5,
			{},
			null,
			undefined,
			NaN,
			[],
			function(){}
		];
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				createQuery({
					'all':value
				});
			};
		}
	});

	it( 'should throw an error if provided an `interval` option which is not a positive number', function test() {
		var values = [
			'5',
			-5,
			0,
			{},
			null,
			undefined,
			NaN,
			[],
			function(){}
		];
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				createQuery({
					'interval':value
				});
			};
		}
	});

	xit( 'should poll', function test( done ) {
		var count = 0,
			get,
			id;

		get = proxyquire( mpath, {
			'request': request
		});

		id = get({
			'uri': 'https://api.github.com/user/repos',
			'all': false,
			'interval': 100 // Don't do this in production! You'll max out your rate limit!
		}, clbk );

		function request( opts, clbk ) {
			clbk( null, {
				'statusCode':200
			}, '[{"beep":"boop"}]' );
		}

		function clbk( error, body ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.isArray( body );
			}
			if ( ++count === 2 ) {
				clearInterval( id );
				done();
			}
		}
	});

});
