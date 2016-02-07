'use strict';

// MODULES //

var isObject = require( 'validate.io-object' );
var isString = require( 'validate.io-string-primitive' );
var isNonNegativeInteger = require( 'validate.io-nonnegative-integer' );
var isPositiveInteger = require( 'validate.io-positive-integer' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {String} [options.protocol] - request protocol
* @param {String} [options.hostname] - endpoint hostname
* @param {Number} [options.port] - endpoint port
* @param {String} [options.pathname] - resource pathname
* @param {Number} [options.page] - resource page
* @param {Number} [options.last_page] - last resource page
* @param {Number} [options.per_page] - page size
* @param {String} [options.token] - Github personal access token
* @param {String} [options.accept] - media type
* @param {String} [options.useragent] - user agent string
* @param {Object} options - options to validate
* @returns {Error|Null} error or null
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	if ( options.hasOwnProperty( 'protocol' ) ) {
		opts.protocol = options.protocol;
		if ( !isString( opts.protocol ) ) {
			return new TypeError( 'invalid option. Protocol option must be a string primitive. Option: `' + opts.protocol + '`.' );
		}
		if ( opts.protocol !== 'http' && opts.protocol !== 'https' ) {
			return new Error( 'invalid option. Protocol must be either `http` or `https`. Option: `' + opts.protocol + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'hostname' ) ) {
		opts.hostname = options.hostname;
		if ( !isString( opts.hostname ) ) {
			return new TypeError( 'invalid option. Hostname option must be a string primitive. Option: `' + opts.hostname + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'port' ) ) {
		opts.port = options.port;
		if ( !isNonNegativeInteger( opts.port ) ) {
			return new TypeError( 'invalid option. Port option must be a nonnegative integer. Option: `' + opts.port + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'pathname' ) ) {
		opts.pathname = options.pathname;
		if ( !isString( opts.pathname ) ) {
			return new TypeError( 'invalid option. Pathname option must be a string primitive. Option: `' + opts.pathname + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'page' ) ) {
		opts.page = options.page;
		if ( !isPositiveInteger( opts.page ) ) {
			return new TypeError( 'invalid option. Page option must be a positive integer. Option: `' + opts.page + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'last_page' ) ) {
		opts.last_page = options.last_page;
		if ( !isPositiveInteger( opts.last_page ) && opts.last_page !== 'last' ) {
			return new TypeError( 'invalid option. Last page option must be a positive integer or \'last\'. Option: `' + opts.last_page + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'per_page' ) ) {
		opts.per_page = options.per_page;
		if ( !isPositiveInteger( opts.per_page ) ) {
			return new TypeError( 'invalid option. Per page option must be a positive integer. Option: `' + opts.per_page + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'token' ) ) {
		opts.token = options.token;
		if ( !isString( opts.token ) ) {
			return new TypeError( 'invalid option. Token option must be a string primitive. Option: `' + opts.token + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'accept' ) ) {
		opts.accept = options.accept;
		if ( !isString( opts.accept ) ) {
			return new TypeError( 'invalid option. Accept option must be a string primitive. Option: `' + opts.accept + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'useragent' ) ) {
		opts.useragent = options.useragent;
		if ( !isString( opts.useragent ) ) {
			return new TypeError( 'invalid option. User agent option must be a string primitive. Option: `' + opts.useragent + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
