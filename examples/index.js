'use strict';

var request = require( './../lib' );

var opts;
var req;

opts = {
	'uri': 'https://api.github.com/user/repos?page=1&per_page=100',
	'headers': {
		'User-Agent': 'my-unique-agent',
		'Accept': 'application/vnd.github.moondragon+json',

		// INSERT TOKEN HERE //
		'Authorization': 'token <your_token_goes_here>'
	},
	'all': true
};

req = request( opts, onResponse );
req.on( 'error', onError );

/**
* FUNCTION: onError( error )
*	Event listener invoked upon encountering a request error.
*
* @private
* @param {Error} error - error object
* @returns {Void}
*/
function onError( error ) {
	throw error;
}

/**
* FUNCTION: onResponse( response )
*	Callback invoked upon receiving a response.
*
* @private
* @param {Response} response - request response
* @returns {Void}
*/
function onResponse( response ) {
	response.on( 'data', onData );
	response.on( 'end', onEnd );
}

/**
* FUNCTION: onData( data )
*	Callback invoked upon receiving response data.
*
* @private
* @param {Object[]} data - response data
* @returns {Void}
*/
function onData( data ) {
	console.log( data );
	// returns [{...},{...},...]
}

/**
* FUNCTION: onEnd( evt )
*	Callback invoked upon response end.
*
* @private
* @param {Object} evt - event object
* @returns {Void}
*/
function onEnd( evt ) {
	console.log( evt );
	// returns {...}
}
