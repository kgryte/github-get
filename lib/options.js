'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-get:options' );
var getHeaders = require( './headers.js' );


// OPTIONS //

/**
* FUNCTION: options( opts )
*	Returns request options based on provided options.
*
* @param {Object} opts - provided options
* @param {String} opts.method - request method
* @param {String} opts.protocol - request protocol
* @param {String} opts.hostname - endpoint hostname
* @param {Number} opts.port - endpoint port
* @param {String} [opts.token] - Github personal access token
* @param {String} [opts.accept] - media type
* @param {String} [opts.useragent] - user agent string
* @returns {Object} request options
*/
function options( opts ) {
	var out = {};

	debug( 'Method: %s', opts.method );
	out.method = opts.method;

	debug( 'Protocol: %s', opts.protocol );
	out.protocol = opts.protocol+':';

	debug( 'Hostname: %s', opts.hostname );
	out.hostname = opts.hostname;

	debug( 'Port: %d', opts.port );
	out.port = opts.port;

	out.headers = getHeaders( opts );

	return out;
} // end FUNCTION options()


// EXPORTS //

module.exports = options;