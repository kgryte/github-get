'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-get:checklimit' );


// CHECK RATE LIMIT //

/**
* FUNCTION: checkRateLimit( curr, headers )
*	Checks the response headers to determine if the rate limit information should be updated.
*
* @param {Object} curr - current rate limit info
* @param {Object} headers - HTTP response headers
*/
function checkRateLimit( curr, headers ) {
	var reset;
	var rem;

	reset = +headers[ 'x-ratelimit-reset' ];

	// Account for responses having an old reset time arriving after a rate limit reset. Only consider responses having the latest reset time...
	if ( reset < curr.reset ) {
		debug( 'Response has an old reset time and does not contain any new rate limit information. Reset: %s. Remaining: %s.', curr.reset, curr.remaining );
		return;
	}
	rem = +headers[ 'x-ratelimit-remaining' ];

	// Account for the rate limit being reset during a query sequence...
	if ( reset > curr.reset ) {
		debug( 'Rate limit was reset during query sequence. Reset: %s. Remaining: %s.', reset, rem );
		curr.reset = reset;
		curr.remaining = rem;
		return;
	}
	// Account for responses having the same reset time arriving out-of-order (i.e., a response indicating a higher remaining limit arriving after a response indicating a lower remaining limit).
	if ( rem < curr.remaining ) {
		curr.remaining = rem;
	}
	debug( 'Reset: %s. Remaining: %s.', reset, rem );
} // end FUNCTION checkRateLimit()


// EXPORTS //

module.exports = checkRateLimit;
