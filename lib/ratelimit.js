'use strict';

/**
* FUNCTION: info( headers )
*	Extracts rate limit info from relevant HTTP response headers.
*
* @param {Object} headers - HTTP response headers
* @returns {Object} extracted headers
*/
function info( headers ) {
	return {
		'limit': +headers[ 'x-ratelimit-limit' ],
		'remaining': +headers[ 'x-ratelimit-remaining' ],
		'reset': +headers[ 'x-ratelimit-reset' ]
	};
} // end FUNCTION info()


// EXPORTS //

module.exports = info;
