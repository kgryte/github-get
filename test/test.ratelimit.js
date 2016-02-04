'use strict';

// MODULES //

var tape = require( 'tape' );
var ratelimit = require( './../lib/ratelimit.js' );


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.ok( typeof ratelimit === 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns an object', function test( t ) {
	var headers = ratelimit( {} );
	t.ok( typeof headers === 'object', 'returns an object' );
	t.end();
});

tape( 'the function returns an object with a `limit` property', function test( t ) {
	var headers = ratelimit( {} );
	t.ok( Object.hasOwnProperty( headers, 'limit' ), 'has a `limit` property' );
	t.end();
});

tape( 'the function returns an object with a `remaining` property', function test( t ) {
	var headers = ratelimit( {} );
	t.ok( Object.hasOwnProperty( headers, 'remaining' ), 'has a `remaining` property' );
	t.end();
});

tape( 'the function returns an object with a `reset` property', function test( t ) {
	var headers = ratelimit( {} );
	t.ok( Object.hasOwnProperty( headers, 'reset' ), 'has a `reset` property' );
	t.end();
});
