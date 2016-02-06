'use strict';

// MODULES //

var parseHeader = require( 'parse-link-header' );
var request = require( './request.js' );
var flatten = require( './flatten.js' );
var getHeaders = require( './headers.js' );
var getRateLimit = require( './ratelimit.js' );
var checkRateLimit = require( './checklimit.js' );


// RESOLVE //

/**
* FUNCTION: resolve( opts, clbk )
*	Resolves endpoint resources.
*
* @param {Object} opts - request options
* @param {Function} clbk - callback to invoke after resolving resources
* @returns {Void}
*/
function resolve( opts, clbk ) {

} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;