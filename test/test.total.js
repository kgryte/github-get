'use strict';

// MODULES //

var tape = require( 'tape' );
var getTotal = require( './../lib/total.js' );


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof getTotal, 'function', 'main export is a function' );
	t.end();
});

tape( 'provided a first and last page number, the function returns the total number of pages to resolve', function test( t ) {
	var total = getTotal( 2, 9 );
	t.equal( total, 8, 'returns 8' );
	t.end();
});