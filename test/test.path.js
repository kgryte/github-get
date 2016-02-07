'use strict';

// MODULES //

var tape = require( 'tape' );
var path = require( './../lib/path.js' );


// FUNCTION //

function setup() {
	return {
		'pathname': '/user/repos',
		'page': 2,
		'per_page': 30
	};
}


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof path, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function returns a resource path', function test( t ) {
	var expected;
	var actual;

	expected = '/user/repos?page=2&per_page=30';
	actual = path( setup() );

	t.equal( actual, expected, 'returns a resource path' );
	t.end();
});
