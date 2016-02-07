'use strict';

// MODULES //

var tape = require( 'tape' );
var headers = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof headers, 'function', 'main export is a function' );
	t.end();
});
