'use strict';

// MODULES //

var factory = require( './factory.js' );


// GET //

/**
* FUNCTION: get( [opts,] clbk )
*	Requests resources from a Github API endpoint.
*
* @param {Object} [opts] - function options
* @param {String} [opts.protocol='https'] - request protocol
* @param {String} [opts.hostname='api.github.com'] - endpoint hostname
* @param {Number} [opts.port] - endpoint port
* @param {String} [opts.path='/'] - resource path
* @param {Number} [opts.page=1] - resource page
* @param {Number} [opts.last_page=1] - last resource page
* @param {Number} [opts.per_page=100] - page size
* @param {String} [opts.token] - Github personal access token
* @param {String} [opts.accept='application/vnd.github.moondragon+json'] - media type
* @param {String} [opts.useragent] - user agent string
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Void}
*/
function get( opts, clbk ) {
	if ( arguments.length === 1 ) {
		// "opts" is assumed to be a callback:
		return factory( {}, opts )();
	}
	factory( opts, clbk )();
} // end FUNCTION get()


// EXPORTS //

module.exports = get;
