'use strict';

// MODULES //

var tape = require( 'tape' );
var counts = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof counts, 'function', 'main export is a function' );
	t.end();
});

tape( 'module exports a factory method', function test( t ) {
	t.equal( typeof counts.factory, 'function', 'export includes a factory method' );
	t.end();
});
