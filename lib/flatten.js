'use strict';

/**
* FUNCTION: flatten( arr )
*	Flattens an array of arrays.
*
* @private
* @param {Array[]} arr - array of arrays
* @returns {Array} 1d array
*/
function flatten( arr ) {
	var tmp;
	var out;
	var i;
	var j;
	
	out = [];
	for ( i = 0; i < arr.length; i++ ) {
		tmp = arr[ i ];
		if ( tmp ) {
			for ( j = 0; j < tmp.length; j++ ) {
				out.push( tmp[ j ] );
			}
		}
	}
	return out;
} // end FUNCTION flatten()


// EXPORTS //

module.exports = flatten;
