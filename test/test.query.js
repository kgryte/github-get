/* global require, describe, it, beforeEach */
'use strict';

var mpath = './../lib/query.js';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module for intercepting HTTP requests:
	nock = require( 'nock' ),

	// Deep copy:
	copy = require( 'utils-copy' ),

	// Query class instance:
	createQuery = require( './../lib' ),

	// Module to be tested:
	query = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'query', function tests() {

	// SETUP //

	var HEADERS,
		headers,
		link1,
		link2,
		link3;

	function replace( path ) {
		return path.replace( /\?.*/, '' );
	}

	HEADERS = {
		'x-ratelimit-limit': 5000,
		'x-ratelimit-remaining': 4995,
		'x-ratelimit-reset': Date.now(),
		'link': ''
	};

	link1 = '<https://api.github.com/user/9287/repos?page=2&per_page=100>; rel="next", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';

	link2 = '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="first", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", <https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';

	link3 = '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="first", <https://api.github.com/user/9287/repos?page=2&per_page=100>; rel="prev", <https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';

	beforeEach( function before() {
		headers = copy( HEADERS );
	});

	// TESTS //

	it( 'should export a function', function test() {
		expect( query ).to.be.a( 'function' );
	});

	it( 'should emit an `init` event', function test( done ) {
		var q, scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		q = createQuery({
			'uri': 'https://api.github.com/user/repos'
		});
		q.on( 'init', onInit );

		function onInit( evt ) {
			assert.isObject( evt );
			done();
		}
	});

	it( 'should emit a `request` event when making a request', function test( done ) {
		var q, scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]' );

		q = createQuery({
			'uri': 'https://api.github.com/user/repos'
		});
		q.on( 'request', onRequest );

		function onRequest( evt ) {
			assert.isObject( evt );
			assert.property( evt, 'rid' );
			done();
		}
	});

	it( 'should emit an error if an error is encountered while making a request', function test( done ) {
		var q, scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 404 );

		q = createQuery({
			'uri': 'https://api.github.com/user/repos'
		});
		q.on( 'error', onError );

		function onError( evt ) {
			assert.isObject( evt );
			done();
		}
	});

	it( 'should emit a `data` event for a successful query', function test( done ) {
		var q, scope;

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]', headers );

		q = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		});
		q.on( 'data', onData );

		function onData( evt ) {
			assert.isObject( evt );
			assert.isArray( evt.data );
			done();
		}
	});

	it( 'should return multiple pages as a single JSON array', function test( done ) {
		var expected, q, scope, h1, h2, h3;

		h1 = copy( headers );
		h1.link = link1;

		h2 = copy( headers );
		h2.link = link2;
		h2[ 'x-ratelimit-remaining' ] -= 1;

		h3 = copy( headers );
		h3.link = link3;
		h3[ 'x-ratelimit-remaining' ] -= 1;

		expected = [ {}, {}, {} ];

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]', h1 )
			.get( '/user/repos' )
			.reply( 200, '[{}]', h2 )
			.get( '/user/repos' )
			.reply( 200, '[{}]', h3 );

		q = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': true
		});
		q.on( 'data', onData );

		function onData( evt ) {
			assert.isObject( evt );
			assert.isArray( evt.data );
			assert.ok( evt.data.length === expected.length, 'should have equal length' );
			assert.deepEqual( evt.data, expected, 'should be deep equal' );
			done();
		}
	});

	it( 'should handle a response without a link header (no additional pages)', function test( done ) {
		var expected, q, scope;

		expected = [ {} ];

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]', headers );

		q = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': true
		});
		q.on( 'data', onData );

		function onData( evt ) {
			assert.isObject( evt );
			assert.isArray( evt.data );
			assert.ok( evt.data.length === expected.length, 'should have equal length' );
			assert.deepEqual( evt.data, expected, 'should be deep equal' );
			done();
		}
	});

	it( 'should return partial results if an error is encountered while requesting multiple pages', function test( done ) {
		var expected, q, scope, h1, h2, h3;

		h1 = copy( headers );
		h1.link = link1;

		h2 = copy( headers );
		h2[ 'x-ratelimit-remaining' ] -= 1;

		h3 = copy( headers );
		h3.link = link3;
		h3[ 'x-ratelimit-remaining' ] -= 1;

		expected = [ {}, {} ];

		scope = nock( 'https://api.github.com' )
			.filteringPath( replace )
			.get( '/user/repos' )
			.reply( 200, '[{}]', h1 )
			.get( '/user/repos' )
			.reply( 404, 'Resource not found', h2 )
			.get( '/user/repos' )
			.reply( 200, '[{}]', h3 );

		q = createQuery({
			'uri': 'https://api.github.com/user/repos',
			'all': true
		});
		q.on( 'data', onData );
		q.on( 'error', onError );

		function onError() {}

		function onData( evt ) {
			assert.isObject( evt );
			assert.isArray( evt.data );
			assert.ok( evt.data.length === expected.length, 'should have equal length' );
			assert.deepEqual( evt.data, expected, 'should be deep equal' );
			done();
		}
	});

});