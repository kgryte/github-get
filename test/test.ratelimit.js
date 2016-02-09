'use strict';

// MODULES //

var tape = require( 'tape' );
var ratelimit = require( './../lib/ratelimit.js' );


// FUNCTIONS //

function setup() {
	return {
		'x-ratelimit-limit': '5000',
		'x-ratelimit-remaining': '4984',
		'x-ratelimit-reset': '1372700873'
	};
}


// TESTS //

tape( 'the main export is a function', function test( t ) {
	t.equal( typeof ratelimit, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns an object', function test( t ) {
	var info = ratelimit( setup() );
	t.equal( typeof info, 'object', 'returns an object' );
	t.end();
});

tape( 'the function returns an object with a `limit` property', function test( t ) {
	var info = ratelimit( setup() );
	t.ok( info.hasOwnProperty( 'limit' ), 'has a `limit` property' );
	t.equal( info.limit, 5000, 'equals 5000' );
	t.end();
});

tape( 'the function returns an object with a `remaining` property', function test( t ) {
	var info = ratelimit( setup() );
	t.ok( info.hasOwnProperty( 'remaining' ), 'has a `remaining` property' );
	t.equal( info.remaining, 4984, 'equals 4984' );
	t.end();
});

tape( 'the function returns an object with a `reset` property', function test( t ) {
	var info = ratelimit( setup() );
	t.ok( info.hasOwnProperty( 'reset' ), 'has a `reset` property' );
	t.equal( info.reset, 1372700873, 'equals 1372700873' );
	t.end();
});
