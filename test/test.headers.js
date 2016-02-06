'use strict';

// MODULES //

var tape = require( 'tape' );
var getHeaders = require( './../lib/headers.js' );


// FUNCTIONS //

function setup() {
	return {
		'date': (new Date()).toISOString(),
		'content-length': '500',
		'status': '200'
	};
}


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof getHeaders, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns an object', function test( t ) {
	var headers = getHeaders( setup() );
	t.equal( typeof headers, 'object', 'returns an object' );
	t.end();
});

tape( 'the function returns an object with a `date` property', function test( t ) {
	var headers = setup();
	var out = getHeaders( headers );
	t.ok( out.hasOwnProperty( 'date' ), 'has `date` property' );
	t.equal( out.date.valueOf(), headers.date.valueOf(), 'equal date value' );
	t.end();
});

tape( 'the function returns an object with a `content-length` property', function test( t ) {
	var headers = getHeaders( setup() );
	t.ok( headers.hasOwnProperty( 'content-length' ), 'has `content-length` property' );
	t.equal( headers[ 'content-length' ], '500', 'equals 500' );
	t.end();
});

tape( 'the function returns an object with a `status` property', function test( t ) {
	var headers = getHeaders( setup() );
	t.ok( headers.hasOwnProperty( 'status' ), 'has `status` property' );
	t.equal( headers.status, '200', 'equals 200' );
	t.end();
});
