'use strict';

// MODULES //

var EventEmitter = require( 'events' ).EventEmitter,
	merge = require( 'utils-merge2' )(),
	isObject = require( 'validate.io-object' ),
	isPositive = require( 'validate.io-positive' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	query = require( './query.js' ),
	poll = require( './poll.js' );


// VARIABLES //

var defaults = require( './defaults.json' );


// QUERY //

/**
* FUNCTION: Query( opts )
*	Query constructor.
*
* @constructor
* @param {Object} opts - request options
* @returns {Query} Query instance
*/
function Query( opts ) {
	var self,
		poll;
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
	}
	// [4] Ensure a valid `interval` option...
	if ( opts.hasOwnProperty( 'interval' ) ) {
		if ( !isPositive( opts.interval ) ) {
			throw new TypeError( 'get()::invalid option. `interval` option must be a positive number. Option: `' + opts.interval + '`.' );
		}
		poll = true;
		this._interval = opts.interval;
		delete opts.interval;
	} else {
		this._interval = 60 * 60 * 1000; // 1hr
	}
	// [5] Ensure that the request method is always `GET`:
	opts.method = 'GET';

	// [6] Cache the request options:
	this._opts = opts;

	// [7] Expose a property for setting and getting the interval...
	Object.defineProperty( this, 'interval', {
		'set': function set( val ) {
			var err;
			if ( !isPositive( val ) ) {
				err = new TypeError( 'interval::invalid value. `interval` must be a positive number. Value: `' + val + '`.' );
				this.emit( 'error', err );
				return;
			}
			this._interval = val;

			// Start polling the Github API endpoint:
			this.start();
		},
		'get': function get() {
			return this._interval;
		},
		'configurable': false,
		'enumerable': true
	});

	// [8] Expose a property for setting and getting the `all` option...
	Object.defineProperty( this, 'all', {
		'set': function set( val ) {
			var err;
			if ( !isBoolean( val ) ) {
				err = new TypeError( 'all::invalid value. `all` must be a boolean primitive. Value: `' + val + '`.' );
				this.emit( 'error', err );
				return;
			}
			this._getAll = val;
		},
		'get': function get() {
			return this._getAll;
		},
		'configurable': false,
		'enumerable': true
	});

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
	if ( poll ) {
		setTimeout( start, 0 );
	} else {
		setTimeout( request, 0 );
	}
	return this;

	/**
	* FUNCTION: init( qid )
	*	Event listener invoked when a query is to begin querying the Github API.
	*
	* @private
	* @param {Number} qid - query id
	*/
	function init( qid ) {
		self._cache[ qid ] = true;
		self._pending += 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION init()

	/**
	* FUNCTION: end( qid )
	*	Event listener invoked when a query ends.
	*
	* @private
	* @param {Number} qid - query id
	*/
	function end( qid ) {
		delete self._cache[ qid ];
		self._pending -= 1;
		self.emit( 'pending', self._pending );
	} // end FUNCTION end()

	/**
	* FUNCTION: start()
	*	Starts polling the Github API endpoint.
	*
	* @private
	*/
	function start() {
		self.start();
	} // end FUNCTION start()

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
* METHOD: start()
*	Starts polling the Github API.
*
* @returns {Query} Query instance
*/
Query.prototype.start = function() {
	// Clear any existing interval timers:
	this.stop();

	// Create a new interval timer and start polling...
	this.emit( 'start', null );
	this._id = setInterval( poll( this ), this._interval );

	return this;
}; // end METHOD start()

/**
* METHOD: stop()
*	Stops polling the Github API.
*
* @returns {Query} Query instance
*/
Query.prototype.stop = function() {
	if ( this._id ) {
		clearInterval( this._id );
		this._id = null;
		this.emit( 'stop', null );
	}
	return this;
}; // end METHOD stop()


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
