'use strict';

// MODULES //

var tape = require( 'tape' );
var path = require( './../lib/path.js' );


// FUNCTION //

function setup() {
	return {
		'pathname': '/user/repos',
		'page': 2,
		'per_page': 30,
		'query': ''
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

tape( 'the function returns a resource path (query string)', function test( t ) {
	var expected;
	var actual;
	var opts;

	expected = '/user/repos?beep=boop&a=b&page=2&per_page=30';

	opts = setup();
	opts.query = 'beep=boop&a=b';

	actual = path( opts );

	t.equal( actual, expected, 'returns a resource path' );
	t.end();
});
