'use strict';

// MODULES //

var tape = require( 'tape' );
var isArray = require( 'validate.io-array' );
var create = require( './../lib/cache.js' );


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof create, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns a cache of a specified size', function test( t ) {
	var cache = create( 10 );
	t.ok( isArray( cache ), 'returns an array' );
	t.equal( cache.length, 10, 'has length 10' );
	t.end();
});