'use strict';

// MODULES //

var tape = require( 'tape' );
var assert = require( 'chai' ).assert;
var proxyquire = require( 'proxyquire' );
var get = require( './../lib/get.js' );


// FIXTURES //

var getOpts = require( './fixtures/opts.js' );
var data = require( './fixtures/results.json' );
var info = require( './fixtures/info.json' );


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof get, 'function', 'export is a function' );
	t.end();
});

tape( 'function returns an error to a provided callback if an error is encountered when requesting resources', function test( t ) {
	var opts;
	var get;
	
	get = proxyquire( './../lib/get.js', {
		'./factory.js': factory
	});

	opts = getOpts();
	get( opts, done );

	function factory( opts, clbk ) {
		return function get() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( new Error( 'beep' ), null, info );
			}
		};
	}

	function done( error ) {
		t.ok( error instanceof Error, 'error instance' );
		t.equal( error.message, 'beep' );
		t.end();
	}
});

tape( 'function returns response data to a provided callback', function test( t ) {
	var expected;
	var opts;
	var get;
	
	get = proxyquire( './../lib/get.js', {
		'./factory.js': factory
	});

	expected = data;

	opts = getOpts();
	get( opts, done );

	function factory( opts, clbk ) {
		return function get() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, data, info );
			}
		};
	}

	function done( error, data ) {
		assert.deepEqual( data, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});

tape( 'function returns rate limit info to a provided callback', function test( t ) {
	var expected;
	var opts;
	var get;
	
	get = proxyquire( './../lib/get.js', {
		'./factory.js': factory
	});

	expected = info;

	opts = getOpts();
	get( opts, done );

	function factory( opts, clbk ) {
		return function get() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, data, info );
			}
		};
	}

	function done( error, data, info ) {
		assert.deepEqual( info, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});

tape( 'function does not require options', function test( t ) {
	var expected;
	var get;
	
	get = proxyquire( './../lib/get.js', {
		'./factory.js': factory
	});

	expected = data;

	get( done );

	function factory( opts, clbk ) {
		assert.deepEqual( opts, {}, 'empty object' );
		return function get() {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				clbk( null, data, info );
			}
		};
	}

	function done( error, data ) {
		assert.deepEqual( data, expected );
		t.ok( true, 'deep equal' );
		t.end();
	}
});
