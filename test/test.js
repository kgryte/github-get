'use strict';

// MODULES //

var tape = require( 'tape' );
var request = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof request, 'function', 'main export is a function' );
	t.end();
});

tape( 'module exports a factory method', function test( t ) {
	t.equal( typeof request.factory, 'function', 'export includes a factory method' );
	t.end();
});
