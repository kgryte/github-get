'use strict';

// MODULES //

var debug = require( 'debug' )( 'github-get:checklimit' );
var copy = require( 'utils-copy' );


// CHECK RATE LIMIT //

/**
* FUNCTION: update( curr, headers )
*	Checks the response headers to determine if the rate limit information should be updated.
*
* @param {Object} curr - current rate limit info
* @param {Object} headers - HTTP response headers
* @returns {Object} updated rate limit info
*/
function update( curr, headers ) {
	var reset;
	var rem;

	curr = copy( curr );

	reset = +headers[ 'x-ratelimit-reset' ];

	// Account for responses having an old reset time arriving after a rate limit reset. Only consider responses having the latest reset time...
	if ( reset < curr.reset ) {
		debug( 'Response has an old reset time and does not contain any new rate limit information. Reset: %s. Remaining: %s.', curr.reset, curr.remaining );
		return curr;
	}
	rem = +headers[ 'x-ratelimit-remaining' ];

	// Account for the rate limit being reset during a query sequence...
	if ( reset > curr.reset ) {
		debug( 'Rate limit was reset during query sequence. Reset: %s. Remaining: %s.', reset, rem );
		curr.reset = reset;
		curr.remaining = rem;
		return curr;
	}
	// Account for responses having the same reset time arriving out-of-order (i.e., a response indicating a higher remaining limit arriving after a response indicating a lower remaining limit).
	if ( rem < curr.remaining ) {
		curr.remaining = rem;
	}
	debug( 'Reset: %s. Remaining: %s.', reset, rem );
	return curr;
} // end FUNCTION update()


// EXPORTS //

module.exports = update;
