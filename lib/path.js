'use strict';

/**
* FUNCTION: path( opts )
*	Returns a resource path (pathname + search).
*
* @param {Object} opts - function options
* @param {String} opts.pathname - resource pathname
* @param {Number} opts.page - resource page
* @param {Number} opts.per_page - page size
* @returns {String} resource path
*/
function path( opts ) {
	var search = '?';
	search += 'page=' + opts.page;
	search += '&';
	search += 'per_page=' + opts.per_page;
	return opts.pathname + search;
} // end FUNCTION path()


// EXPORTS //

module.exports = path;