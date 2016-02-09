'use strict';

/**
* FUNCTION: lastPage( opt, last )
*	Determines the last page to resolve.
*
* @param {Number|String} opt - last page option
* @param {Number} last - last linked page
* @returns {Number} last page to resolve
*/
function lastPage( opt, last ) {
	if (
		opt !== 'last' &&
		opt < last
	) {
		last = opt;
	}
	return last;
} // end FUNCTION lastPage()


// EXPORTS //

module.exports = lastPage;