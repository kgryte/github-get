'use strict';

// MODULES //

var tape = require( 'tape' );
var noop = require( '@kgryte/noop' );
var response = require( './../lib/response_handler.js' );


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.ok( typeof response === 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns a response handler', function test( t ) {
	var onResponse = response( 0, 0, noop );
	t.ok( typeof onResponse === 'function', 'returns a function' );
	t.end();
});

tape( 'the response handler forwards request errors', function test( t ) {
	var onResponse;
	var res;

	res = {};

	onResponse = response( 0, 0, clbk );
	onResponse( new Error( 'beep' ), res );

	function clbk( err ) {
		t.ok( err, 'forwards an error' );
		t.end();
	}
});

tape( 'if a response status code is not `200`, the response handler returns an error', function test( t ) {
	var onResponse;
	var res;

	res = {
		'statusCode': 404
	};

	onResponse = response( 0, 0, clbk );
	onResponse( null, res );

	function clbk( err ) {
		if ( err ) {
			t.ok( true, 'forwards an error' );
			t.equal( err.status, 404, 'status property is 404' );
		} else {
			t.ok( false, 'forwards an error' );
		}
		t.end();
	}
});

tape( 'if unable to parse the response body as JSON, the response handler returns an error', function test( t ) {
	var onResponse;
	var body;
	var res;

	res = {
		'statusCode': 200
	};

	body = '[{"beep:"boop"}]';

	onResponse = response( 0, 0, clbk );
	onResponse( null, res, body );

	function clbk( err ) {
		if ( err ) {
			t.ok( true, 'forwards an error' );
			t.equal( err.status, 502, 'status property is 502' );
		} else {
			t.ok( false, 'forwards an error' );
		}
		t.end();
	}
});

tape( 'if no errors are encountered while handling a response, the response handler returns headers and an event object', function test( t ) {
	var onResponse;
	var expected;
	var body;
	var res;

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
		t.notOk( err, 'no error' );
		
		t.ok( typeof headers === 'object', 'headers argument is an object' );
		t.equal( headers, res.headers, 'headers argument is the raw response header object' );

		t.ok( typeof evt === 'object', 'evt argument is an object' );
		t.deepEqual( evt.data, expected, 'event data is the parsed JSON response data' );

		t.end();
	}
});
