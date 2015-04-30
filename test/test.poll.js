/* global require, describe, it */
'use strict';

var mpath = './../lib/poll.js';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to proxy module dependencies:
	proxyquire = require( 'proxyquire' ),

	// Module to be tested:
	getPoll = require( './../lib/poll.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'poll', function tests() {

	var query = {
		'_opts': {
			'qs': {
				'page': 1
			}
		}
	};

	it( 'should export a function', function test() {
		expect( getPoll ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		var poll = getPoll( query );
		assert.isFunction( poll );
	});

	it( 'should set the query context', function test( done ) {
		var getPoll, poll;

		getPoll = proxyquire( mpath, {
			'./query.js': fcn
		});

		poll = getPoll( query );
		poll();

		function fcn() {
			/* jshint validthis: true */
			assert.strictEqual( this, query );
			done();
		}
	});

});
