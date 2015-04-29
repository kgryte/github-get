'use strict';

var createQuery = require( './../lib' );

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
	'all': true,
	'interval': 10000
};

/**
* FUNCTION: onError( evt )
*	Event listener invoked when a query instance emits an `error`.
*
* @param {Object} evt - error event object
*/
function onError( evt ) {
	console.error( evt );
}

/**
* FUNCTION: onRequest( evt )
*	Event listener invoked when a query makes a request to the Github API.
*
* @param {Object} evt - event object
*/
function onRequest( evt ) {
	console.log( evt );
}

/**
* FUNCTION: onPage( evt )
*	Event listener invoked when a query receives a paginated result.
*
* @param {Object} evt - page event object
*/
function onPage( evt ) {
	var pct = evt.count / evt.total * 100;
	console.log( 'Query %d progress: %d%.' , evt.qid, Math.round( pct ) );
}

/**
* FUNCTION: onData( evt )
*	Event listener invoked when all data has been received.
*
* @param {Object} evt - event object
*/
function onData( evt ) {
	console.log( evt.data );
}

/**
* FUNCTION: onEnd( evt )
*	Event listener invoked when a query ends.
*
* @param {Object} evt - end event object
*/
function onEnd( evt ) {
	console.log( 'Query %d ended...', evt.qid );
	console.dir( evt.ratelimit );
}

var query = createQuery( opts );
query.on( 'error', onError );
query.on( 'request', onRequest );
query.on( 'page', onPage );
query.on( 'data', onData );
query.on( 'end', onEnd );

// Stop polling after 60 seconds...
setTimeout( function stop() {
	query.stop();
}, 60000 );
