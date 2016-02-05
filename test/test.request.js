'use strict';

// MODULES //

var tape = require( 'tape' );
var proxyquire = require( 'proxyquire' );
var assert = require( 'chai' ).assert;
var request = require( './../lib/request.js' );


// FIXTURES //

var getOpts = require( './fixtures/opts.js' );
var http = require( './fixtures/http.js' );
var data = require( './fixtures/results.json' );


// TESTS //

tape( 'file exports a function', function test( t ) {
	t.equal( typeof request, 'function', 'main export is a function' );
	t.end();
});

tape( 'if unable to query an endpoint, an error is returned to a provided callback', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = getOpts();
	opts.protocol = 'http';

	mock = http( new Error( 'beep' ) );

	request = proxyquire( './../lib/request.js', {
		'http': mock
	});

	request( opts, clbk );

	function clbk( error ) {
		t.equal( typeof error, 'object', 'error is an object' );
		t.equal( error.status, 500, '500 status' );
		t.equal( error.message, 'Request error: beep', 'message contains error message' );
		t.end();
	}
});

tape( 'if an endpoint returns a status code other than 200, an error containing the status code, the HTTP response object, and the response body are returned to a provided callback', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = getOpts();
	opts.protocol = 'http';

	mock = http( null, 404 );

	request = proxyquire( './../lib/request.js', {
		'http': mock
	});

	request( opts, clbk );

	function clbk( error, response, body ) {
		t.equal( error.status, 404, 'equal status codes' );
		t.equal( error.message, 'bad request', 'equal messages' );

		t.equal( typeof response, 'object', 'second argument is an object' );

		t.equal( typeof body, 'string', 'third argument is a string' );

		t.end();
	}
});

tape( 'if an endpoint returns an invalid JSON response, an error with a status code of 502 (bad gateway; invalid response from upstream server), the HTTP response object, and the response body are returned to a provided callback', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = getOpts();
	opts.protocol = 'http';

	mock = http( null, 200 );

	request = proxyquire( './../lib/request.js', {
		'http': mock,
		'utils-json-parse': parse
	});

	request( opts, clbk );

	function parse() {
		return new Error( 'bad json' );
	}

	function clbk( error, response, body ) {
		t.equal( error.status, 502, 'equal status codes' );
		t.equal( typeof error.message, 'string', 'error message' );

		t.equal( typeof response, 'object', 'second argument is an object' );

		t.equal( typeof body, 'string', 'third argument is a string' );

		t.end();
	}
});

tape( 'if a query is successful, a JSON object is returned to a provided callback', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = getOpts();
	opts.protocol = 'http';

	mock = http( null, 200 );

	request = proxyquire( './../lib/request.js', {
		'http': mock
	});

	request( opts, clbk );

	function clbk( error, response, body ) {
		if ( error ) {
			throw error;
		}
		t.equal( typeof response, 'object', 'second argument is an object' );

		t.equal( typeof body, 'object', 'returns an object' );
		assert.deepEqual( body, data );
		t.ok( true, 'deep equal' );

		t.end();
	}
});

tape( 'HTTPS is supported', function test( t ) {
	var request;
	var mock;
	var opts;

	opts = getOpts();
	opts.protocol = 'https';

	mock = http( null, 200 );

	request = proxyquire( './../lib/request.js', {
		'https': mock
	});

	request( opts, clbk );

	function clbk( error, response, body ) {
		if ( error ) {
			throw error;
		}
		t.equal( typeof response, 'object', 'second argument is an object' );

		t.equal( typeof body, 'object', 'returns an object' );

		assert.deepEqual( body, data );
		t.ok( true, 'deep equal' );

		t.end();
	}
});
