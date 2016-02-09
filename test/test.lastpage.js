'use strict';

// MODULES //

var tape = require( 'tape' );
var lastPage = require( './../lib/lastpage.js' );


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof lastPage, 'function', 'main export is a function' );
	t.end();
});

tape( 'if provided a last page option equal to "last", the function returns the last linked page', function test( t ) {
	var last = lastPage( 'last', 6 );
	t.equal( last, 6, 'equals 6' );
	t.end();
});

tape( 'if provided a last page option equal to or exceeding the last linked page, the function returns the last linked page', function test( t ) {
	var last = lastPage( 10, 6 );
	t.equal( last, 6, 'equals 6' );
	t.end();
});

tape( 'if provided a last page option less than the last linked page, the function returns the last page option value', function test( t ) {
	var last = lastPage( 4, 6 );
	t.equal( last, 4, 'equals 4' );
	t.end();
});