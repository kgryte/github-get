/* global require, describe, it */
'use strict';

var mpath = './../lib';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module for mocking dependencies:
	proxyquire = require( 'proxyquire' ),

	// Module to be tested:
	get = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( '@kgryte/github-get', function tests() {

	it( 'should export a function', function test() {
		expect( get ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			true,
			null,
			undefined,
			NaN,
			[],
			function(){}
		];
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				get( value, function(){} );
			};
		}
	});

	it( 'should throw an error if provided a callback argument which is not a function', function test() {
		var values = [
			'5',
			5,
			true,
			null,
			undefined,
			NaN,
			[],
			{}
		];
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				get( {}, value );
			};
		}
	});

	it( 'should throw an error if provided an `all` option which is not a boolean primitive', function test() {
		var values = [
			'5',
			5,
			{},
			null,
			undefined,
			NaN,
			[],
			function(){}
		];
		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				get({
					'all':value
				}, function(){} );
			};
		}
	});

	it( 'should return an error if unable to query the Github API', function test( done ) {
		get({
			'uri': 'unknown_UrL_Beep_booP'
		}, clbk );

		function clbk( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should return an error if the status code is not 200', function test( done ) {
		var get = proxyquire( mpath, {
			'request': request
		});

		get({
			'uri': 'https://api.github.com/user/repos'
		}, clbk );

		function request( opts, clbk ) {
			clbk( null, {
				'statusCode':404
			});
		}

		function clbk( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should return an error if unable to parse the response body as JSON', function test( done ) {
		var get = proxyquire( mpath, {
			'request': request
		});

		get({
			'uri': 'https://api.github.com/user/repos'
		}, clbk );

		function request( opts, clbk ) {
			clbk( null, {
				'statusCode':200
			}, '{"beep:"boop"}' );
		}

		function clbk( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should return a JSON array', function test( done ) {
		var get = proxyquire( mpath, {
			'request': request
		});

		get({
			'uri': 'https://api.github.com/user/repos',
			'all': false
		}, clbk );

		function request( opts, clbk ) {
			clbk( null, {
				'statusCode':200
			}, '[{"beep":"boop"}]' );
		}

		function clbk( error, body ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.isArray( body );
			}
			done();
		}
	});

	it( 'should return multiple pages as a single JSON array', function test( done ) {
		var count = 0,
			get;

		get = proxyquire( mpath, {
			'request': request
		});

		get({
			'uri': 'https://api.github.com/user/repos',
			'all': true
		}, clbk );

		function request( opts, clbk ) {
			var res = {},
				link;

			count += 1;
			if ( count === 1 ) {
				link = '<https://api.github.com/user/9287/repos?page=2&per_page=100>; rel="next", ' +
				'<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';
			} else if ( count === 2 ) {
				link = '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="first", ' +
				'<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="next", ' +
				'<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="prev", ' +
				'<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';
			} else {
				link = '<https://api.github.com/user/9287/repos?page=1&per_page=100>; rel="first", ' +
				'<https://api.github.com/user/9287/repos?page=2&per_page=100>; rel="prev", ' +
				'<https://api.github.com/user/9287/repos?page=3&per_page=100>; rel="last"';
			}
			res.statusCode = 200;
			res.headers = {
				'link': link
			};

			clbk( null, res, '[{"beep":"boop"}]' );
		}

		function clbk( error, body ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.isArray( body );
			}
			done();
		}
	});

	it( 'should handle a response without a link header (no additional pages)', function test( done ) {
		var get = proxyquire( mpath, {
			'request': request
		});

		get({
			'uri': 'https://api.github.com/user/repos',
			'all': true
		}, clbk );

		function request( opts, clbk ) {
			var res = {};
			res.statusCode = 200;
			res.headers = {};
			clbk( null, res, '[{"beep":"boop"}]' );
		}

		function clbk( error, body ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.isArray( body );
			}
			done();
		}
	});

});
