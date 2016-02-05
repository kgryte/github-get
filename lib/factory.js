'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' );
var merge = require( 'utils-merge2' )();
var validate = require( './validate.js' );
var defaults = require( './defaults.json' );
var resolve = require( './resolve.js' );


// FACTORY //

/**
* FUNCTION: factory( options, clbk )
*	Returns a function for fetching resources from a Github API endpoint.
*
* @param {Object} options - function options
* @param {Function} clbk - callback to invoke upon query completion
* @returns {Function} function for getting download counts
*/
function factory( options, clbk ) {
	var opts;
	var err;
	opts = merge( {}, defaults );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	if ( !isFunction( clbk ) ) {
		throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
	}
	/**
	* FUNCTION: get()
	*	Resolves endpoint resources.
	*
	* @returns {Void}
	*/
	return function get() {
		resolve( opts, done );
		/**
		* FUNCTION: done( error, data, info )
		*	Callback invoked after resolving resources.
		*
		* @private
		* @param {Error|Null} error - error object
		* @param {Object[]} data - query data
		* @param {Object} info - response info
		* @returns {Void}
		*/
		function done( error, data, info ) {
			error = error || null;
			data = data || null;
			info = info || null;
			clbk( error, data, info );
		} // end FUNCTION done()
	}; // end FUNCTION get()
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
