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

	function replace( path ) {
		return path.replace( /\?.*/, '' );
	}

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

	it( 'should expose an `interval` attribute', function test() {
		var query, scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		expect( query.interval ).to.be.a( 'number' );
	});

	it( 'should expose an `all` attribute', function test() {
		var query, scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		expect( query.all ).to.be.a( 'boolean' );
	});

	it( 'should expose a read-only `pending` attribute', function test() {
		var query, scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		expect( query.pending ).to.be.a( 'number' );
		expect( foo ).to.throw( Error );

		function foo() {
			query.pending = 5;
		}
	});

	it( 'should emit an error if a user attempts to assign an invalid interval', function test( done ) {
		var count = 0,
			scope,
			values,
			query;

		values = [
			'5',
			-1,
			0,
			null,
			undefined,
			NaN,
			true,
			[],
			{},
			function(){}
		];

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		query.on( 'error', onError );

		for ( var i = 0; i < values.length; i++ ) {
			query.interval = values[ i ];
		}

		function onError( evt ) {
			assert.ok( evt instanceof TypeError );
			count += 1;
			if ( count === values.length ) {
				done();
			}
		}
	});

	it( 'should emit an error if a user attempts to assign an invalid `all` value', function test( done ) {
		var count = 0,
			scope,
			values,
			query;

		values = [
			'5',
			1,
			null,
			undefined,
			NaN,
			new Boolean( true ),
			[],
			{},
			function(){}
		];

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		query.on( 'error', onError );

		for ( var i = 0; i < values.length; i++ ) {
			query.all = values[ i ];
		}

		function onError( evt ) {
			assert.ok( evt instanceof TypeError );
			count += 1;
			if ( count === values.length ) {
				done();
			}
		}
	});

	it( 'should get/set the `all` attribute', function test() {
		var query,
			scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		assert.isFalse( query.all );

		query.all = true;
		assert.isTrue( query.all );
	});

	it( 'should provide a method for submitting a query manually', function test() {
		var query,
			scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		assert.isFunction( query.query );
	});

	it( 'should query an endpoint', function test( done ) {
		var count = 0,
			query,
			scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		query.on( 'end', onEnd );
		query.query();

		function onEnd() {
			if ( ++count === 2 ) {
				assert.ok( scope.isDone() );
				done();
			}
		}
	});

	it( 'should emit a `pending` event while waiting for an HTTP response and again after an HTTP response has been received', function test( done ) {
		var count = 0,
			query,
			scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		query.on( 'pending', onPending );

		function onPending( num ) {
			count += 1;
			if ( count === 1 ) {
				if ( num !== 1 ) {
					assert.ok( false );
				}
				return;
			}
			if ( num !== 0 ) {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should emit a `start` event when starting to poll an endpoint', function test( done ) {
		var query,
			scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false,
			'interval': 60000
		});

		query.on( 'start', onStart );

		function onStart() {
			query.stop();
			assert.ok( true );
			done();
		}
	});

	it( 'should emit a `stop` event when stopping endpoint polling', function test( done ) {
		var query,
			scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false,
			'interval': 60000
		});

		query.on( 'start', onStart );
		query.on( 'stop', onStop );

		function onStart() {
			setTimeout( onTimeout, 200 );
			function onTimeout() {
				query.stop();
			}
		}
		function onStop() {
			assert.ok( true );
			done();
		}
	});

	it( 'should start polling when the `interval` attribute is set', function test( done ) {
		var query,
			scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		query = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});

		query.on( 'start', onStart );

		query.interval = 60000;

		function onStart() {
			setTimeout( onTimeout, 200 );
		}

		function onTimeout() {
			query.stop();
			assert.strictEqual( query.interval, 60000 );
			assert.ok( scope.isDone() );
			done();
		}
	});

});
