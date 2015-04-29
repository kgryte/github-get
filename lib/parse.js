'use strict';

/**
* FUNCTION: parse( str )
*	Attempts to parse a string as JSON.
*
* @private
* @param {String} str - input string
* @returns {Object|Null} JSON object or null
*/
function parse( str ) {
	try {
		return JSON.parse( str );
	} catch ( err ) {
		return null;
	}
} // end FUNCTION parse()


// EXPORTS //

module.exports = parse;
