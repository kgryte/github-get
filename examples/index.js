'use strict';

var get = require( './../lib' );

var opts = {
	'uri': 'https://api.github.com/user/repos',
	'headers': {
		'User-Agent': 'my-unique-agent',
		'Accept': 'application/vnd.github.moondragon+json',

		// INSERT TOKEN HERE //
		'Authorization': 'token <your_token_goes_here>'
	},
	'qs': {
		'page': 1,
		'per_page': 100
	},
	'all': true
};

get( opts, onResponse );

function onResponse( error, body ) {
	if ( error ) {
		console.error( error );
		return;
	}
	console.log( body );
}
