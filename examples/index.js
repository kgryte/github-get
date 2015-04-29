'use strict';

var createQuery = require( './../lib' );

var opts = {
	'uri': 'https://api.github.com/user/repos',
	'headers': {
		'User-Agent': 'my-unique-agent',
		'Accept': 'application/vnd.github.moondragon+json',

		// INSERT TOKEN HERE //
		'Authorization': 'token <your_token_goes_here>'

		//
	},
	'qs': {
		'page': 1,
		'per_page': 100
	},
	'all': true,
	'interval': 10000
};

var query = createQuery( opts );

query.on( 'error', onError );
query.on( 'request', onRequest );
query.on( 'page', onPage );
query.on( 'data', onData );
query.on( 'end', onEnd );

setTimeout( function stop() {
	query.stop();
}, 60000 );

function onError( evt ) {
	console.error( evt );
}
function onRequest( evt ) {
	console.log( 'Query %d request...', evt.qid );
}
function onPage( evt ) {
	var progress = evt.count / evt.total * 100;
	console.log( 'Query %d progress: %d%.' , evt.qid, Math.round( progress ) );
}
function onData( evt ) {
	console.log( evt.ratelimit );
}
function onEnd( id ) {
	console.log( 'Query %d ended...', id );
}
