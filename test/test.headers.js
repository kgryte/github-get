'use strict';

// MODULES //

var tape = require( 'tape' );
var getHeaders = require( './../lib/headers.js' );


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof getHeaders, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns an object', function test( t ) {
	var headers = getHeaders( {} );
	t.equal( typeof headers, 'object', 'returns an object' );
	t.end();
});

tape( 'the function returns an object with a `date` property', function test( t ) {
	var headers = getHeaders( {} );
	t.ok( Object.hasOwnProperty( headers, 'date' ), 'has `date` property' );
	t.end();
});

tape( 'the function returns an object with a `content-length` property', function test( t ) {
	var headers = getHeaders( {} );
	t.ok( Object.hasOwnProperty( headers, 'content-length' ), 'has `content-length` property' );
	t.end();
});

tape( 'the function returns an object with a `status` property', function test( t ) {
	var headers = getHeaders( {} );
	t.ok( Object.hasOwnProperty( headers, 'status' ), 'has `status` property' );
	t.end();
});
