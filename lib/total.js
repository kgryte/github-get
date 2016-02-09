'use strict';

/**
* FUNCTION: getTotal( first, last )
*	Determines the total number of pages to resolve.
*
* @param {Number} first - first page to resolve
* @param {Number} last - last page to resolve
* @returns {Number} total number of pages to resolve
*/
function getTotal( first, last ) {
	return last - (first-1);
} // end FUNCTION getTotal()


// EXPORTS //

module.exports = getTotal;