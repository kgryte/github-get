'use strict';

// MODULES //

var EventEmitter = require( 'events' ).EventEmitter;
var merge = require( 'utils-merge2' )();
var isObject = require( 'validate.io-object' );
var isPositive = require( 'validate.io-positive' );
var isBoolean = require( 'validate.io-boolean-primitive' );
var defaults = require( './defaults.json' );
var query = require( './query.js' );


// QUERY //

/**
* FUNCTION: Query( opts )
*	Query constructor.
*
* @constructor
* @param {Object} opts - request options
* @param {Boolean} [opts.all=false] - boolean indicating if all paginated results should be returned from an endpoint
* @returns {Query} Query instance
*/
function Query( opts ) {
	var self;
	if ( !(this instanceof Query) ) {
		return new Query( opts );
	}
	self = this;

	// [0] Make the Query instance an event emitter:
	EventEmitter.call( this );

	// [1] Ensure that request options are provided...
	if ( !isObject( opts ) ) {
		throw new TypeError( 'Query()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
	}
	// [2] Merge the provided request options into the default options...
	opts = merge( {}, defaults, opts );

	// [3] Ensure a valid `all` option...
	if ( opts.hasOwnProperty( 'all' ) ) {
		if ( !isBoolean( opts.all ) ) {
			throw new TypeError( 'get()::invalid option. `all` option must be a boolean primitive. Option: `' + opts.all + '`.' );
		}
		this._getAll = opts.all;
		delete opts.all;
	} else {
		this._getAll = false;
	}
	// [5] Ensure that the request method is always `GET`:
	opts.method = 'GET';

	// [6] Cache the request options:
	this._opts = opts;

	// [9] Expose a property for determining if any requests are pending...
	Object.defineProperty( this, 'pending', {
		'get': function get() {
			return this._pending;
		},
		'configurable': false,
		'enumerable': true
	});
	this._pending = 0;

	// [10] Initialize a request cache which is used to track multi-part and pending requests:
	this._cache = {};

	// [11] Initialize a request count (used for assigning query ids):
	this._qid = 0;

	// [12] Add event listeners to keep track of pending queries...
	this.on( 'init', init );
	this.on( 'end', end );

	// [13] Start querying the endpoint on the next tick...
	setTimeout( request, 0 );
	return this;

	/**
	* FUNCTION: init( evt )
	*	Event listener invoked when a query is to begin querying the Github API.
	*
	* @private
	* @param {Object} evt - init event object
	*/
	function init( evt ) {
		self._cache[ evt.qid ] = true;
		self._pending += 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION init()

	/**
	* FUNCTION: end( evt )
	*	Event listener invoked when a query ends.
	*
	* @private
	* @param {Object} evt - end event object
	*/
	function end( evt ) {
		delete self._cache[ evt.qid ];
		self._pending -= 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION end()

	/**
	* FUNCTION: request()
	*	Makes a single query request to the Github API endpoint.
	*
	* @private
	*/
	function request() {
		self.query();
	} // end FUNCTION request()
} // end FUNCTION Query()

/**
* Create a prototype which inherits from the parent prototype.
*/
Query.prototype = Object.create( EventEmitter.prototype );

/**
* Set the constructor.
*/
Query.prototype.constructor = Query;


/**
* METHOD: query()
*	Queries the Github API.
*
* @returns {Query} Query instance
*/
Query.prototype.query = function() {
	query.call( this );
	return this;
}; // end METHOD query()


// EXPORTS //

module.exports = Query;
