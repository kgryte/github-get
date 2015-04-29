'use strict';

/**
* FUNCTION: getHeaders( headers )
*	Extracts relevant headers from an HTTP response.
*
* @param {Object} headers - HTTP response headers
* @returns {Object} extracted headers
*/
function getHeaders( headers ) {
	return {
		'date': headers.date,
		'content-length': headers[ 'content-length' ],
		'status': headers.status
	};
} // end FUNCTION getHeaders()


// EXPORTS //

module.exports = getHeaders;
