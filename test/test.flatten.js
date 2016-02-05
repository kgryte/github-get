'use strict';

// MODULES //

var tape = require( 'tape' );
var flatten = require( './../lib/flatten.js' );


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof flatten, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function flattens an array of arrays', function test( t ) {
	var expected;
	var actual;
	var arr;

	arr = [ [1,2],[3,4],[5,6] ];

	actual = flatten( arr );
	expected = [ 1, 2, 3, 4, 5, 6 ];

	t.deepEqual( actual, expected, 'deep equal' );
	t.end();
});

tape( 'the function flattens an array which includes missing values', function test( t ) {
	var expected;
	var actual;
	var arr;

	arr = new Array( 3 );
	arr[ 0 ] = [ 1, 2 ];
	arr[ 2 ] = [ 5, 6 ];

	actual = flatten( arr );
	expected = [ 1, 2, 5, 6 ];

	t.deepEqual( actual, expected, 'deep equal' );
	t.end();
});