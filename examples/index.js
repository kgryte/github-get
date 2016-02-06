'use strict';

var request = require( './../lib' );

var opts = {
	'hostname': 'api.github.com',
	'path': '/user/repos',
	'useragent': 'my-unique-agent',
	'accept': 'application/vnd.github.moondragon+json',

	// INSERT TOKEN HERE //
	'token': '<your_token_goes_here>',
	
	'last_page': 'last'
};

request( opts, onResponse );

/**
* FUNCTION: onResponse( error, data, info )
*	Callback invoked upon receiving a response.
*
* @private
* @param {Error|Null} error - error or null
* @param {Object[]} data - response data
* @param {Object} info - rate limit info
* @returns {Void}
*/
function onResponse( error, data, info ) {
	if ( info ) {
		console.error( info );
	}
	if ( error ) {
		throw error;
	}
	console.log( data );
}