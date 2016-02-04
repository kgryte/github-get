'use strict';

var request = require( './../lib' );

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

request( opts, onResponse );

/**
* FUNCTION: onResponse( error, data )
*	Callback invoked upon receiving a response.
*
* @private
* @param {Error|Null} error - error or null
* @param {Object[]} data - response data
* @returns {Void}
*/
function onResponse( error, data ) {
	if ( error ) {
		throw error;
	}
	console.log( JSON.stringify( data ) );
}
