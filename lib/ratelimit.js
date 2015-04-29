'use strict';

/**
* FUNCTION: getHeaders( headers )
*	Extracts ratelimit info from relevant HTTP response headers.
*
* @param {Object} headers - HTTP response headers
* @returns {Object} extracted headers
*/
function getHeaders( headers ) {
	return {
		'limit': +headers[ 'x-ratelimit-limit' ],
		'remaining': +headers[ 'x-ratelimit-remaining' ],
		'reset': +headers[ 'x-ratelimit-reset' ]
	};
} // end FUNCTION getHeaders()


// EXPORTS //

module.exports = getHeaders;
