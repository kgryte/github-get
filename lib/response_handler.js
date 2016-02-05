'use strict';

// MODULES //

var parse = require( 'utils-json-parse' );


// RESPONSE //

/**
* FUNCTION: response( rid, qid, done )
*	Returns a callback to be invoked upon receiving an HTTP response from the Github API.
*
* @param {Number} rid - request id
* @param {Number} qid - query id
* @param {Function} done - callback invoked after processing the HTTP response
* @returns {Function} HTTP response handler
*/
function response( rid, qid, done ) {
	/**
	* FUNCTION: onResponse( error, response, body )
	*	Callback invoked upon receiving an HTTP response from the Github API.
	*
	* @private
	* @param {Error|Null} error - error object or null
	* @param {Object} response - HTTP response object
	* @param {String} body - response body
	*/
	return function onResponse( error, response, body ) {
		var data;
		var evt;

		evt = {
			'rid': rid,
			'qid': qid,
			'time': Date.now()
		};
		if ( error ) {
			evt.status = 500;
			evt.message = 'Request error. Error encountered while attempting to query the Github API.';
			evt.detail = error;
			return done( evt, response.headers, body );
		}
		if ( response.statusCode !== 200 ) {
			evt.status = response.statusCode;
			evt.message = 'Client error.';
			evt.detail = body;
			return done( evt, response.headers, body );
		}
		data = parse( body );
		if ( data instanceof Error ) {
			evt.status = 502;
			evt.message = 'Unable to parse response body as JSON.';
			evt.detail = body;
			return done( evt, response.headers, body );
		}
		evt.data = data;
		done( null, response.headers, evt );
	}; // end FUNCTION onResponse()
} // end FUNCTION response()


// EXPORTS //

module.exports = response;
