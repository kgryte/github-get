'use strict';

/**
* FUNCTION: create( size )
*	Creates a response cache.
*
* @param {Number} size - cache size
* @returns {Array} cache
*/
function create( size ) {
	return new Array( size );
} // end FUNCTION create()


// EXPORTS //

module.exports = create;