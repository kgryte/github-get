'use strict';

/**
* FUNCTION: checkRateLimit( curr, headers )
*	Checks the response headers to determine if the rate limit information should be updated.
*
* @param {Object} curr - current rate limit info
* @param {Object} headers - HTTP response headers
*/
function checkRateLimit( curr, headers ) {
	var reset,
		rem;

	reset = +headers[ 'x-ratelimit-reset' ];

	// [0] Account for responses having an old reset time arriving after a rate limit reset. Only consider responses having the latest reset time...
	if ( reset < curr.reset ) {
		return;
	}
	rem = +headers[ 'x-ratelimit-remaining' ];

	// [1] Account for the rate limit being reset during a query sequence...
	if ( reset > curr.reset ) {
		curr.reset = reset;
		curr.remaining = rem;
		return;
	}
	// [2] Account for responses having the same reset time arriving out-of-order (i.e., a response indicating a higher remaining limit arriving after a response indicating a lower remaining limit).
	if ( rem < curr.remaining ) {
		curr.remaining = rem;
	}
} // end FUNCTION checkRateLimit()


// EXPORTS //

module.exports = checkRateLimit;
