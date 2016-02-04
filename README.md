Github Get
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> Retrieves resources from a [Github API](https://developer.github.com/v3/) endpoint.


## Installation

``` bash
$ npm install @kgryte/github-get
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var createQuery = require( '@kgryte/github-get' );
```


#### createQuery( opts )

Creates a new `Query` instance for retrieving resources from a [Github API](https://developer.github.com/v3/) endpoint.

``` javascript
var opts = {
	'uri': 'https://api.github.com/user/repos'	
};

var query = createQuery( opts );
query.on( 'data', onData );

function onData( evt ) {
	console.log( evt.data );
	// returns [{...},{...},...]
}
```

The `constructor` accepts the standard [request](https://github.com/request/request) options. Additional options are as follows:

-	__all__: `boolean` indicating if all paginated results should be returned from the endpoint. By default, Github [paginates](https://developer.github.com/guides/traversing-with-pagination/) results. Setting this option to `true` instructs the `Query` instance to continue making requests until __all__ pages have been returned. Default: `false`.
-	__interval__: positive `number` defining a poll [interval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) for repeatedly querying the Github API. The interval should be in units of `milliseconds`. If an `interval` is __not__ provided, only a single query is made to the Github API. Default: `3600000` (1hr).

	``` javascript
	var opts = {
		'uri': 'https://api.github.com/user/repos',
		'all': true,
		'interval': 600000 // 10 minutes
	};

	// Every 10 minutes, fetch the list of repos...
	var query = createQuery( opts );
	query.on( 'data', onData );

	function onData( evt ) {
		console.log( evt.data );
		// returns [{...},{...},...]
	}
	``` 



===
### Attributes

A `Query` instance has the following attributes...


#### query.all

Attribute indicating if all paginated results should be returned from the endpoint. By default, Github [paginates](https://developer.github.com/guides/traversing-with-pagination/) results. Setting this option to `true` instructs a `Query` instance to continue making requests until __all__ pages have been returned. Default: `false`.

``` javascript
query.all = true;
```


#### query.interval

Attribute defining a poll [interval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) for repeatedly querying the Github API. An `interval` should be in units of `milliseconds`. Default: `3600000` (1hr).

``` javascript
query.interval = 60000; // 1 minute
```

Once set, a `Query` instance immediately begins polling the Github API according to the specified `interval`.


#### query.pending

Read-only attribute providing the number of pending API requests.

``` javascript
if ( query.pending ) {
	console.log( '%d requests still pending...', query.pending );
}
```


===
### Methods

A `Query` instance has the following methods...

#### query.query()

Instructs a `Query` instance to perform a single query of a Github API endpoint.

``` javascript
query.query();
```

This method is useful when manually polling an endpoint (i.e., no fixed `interval`).


#### query.start()

Instructs a `Query` instance to start polling a Github API endpoint. 

``` javascript
query.start();
```


#### query.stop()

Instructs a `Query` instance to stop polling a Github API endpoint.

``` javascript
query.stop();
```

__Note__: pending requests are still allowed to complete. 



===
### Events

A `Query` instance emits the following events...


#### 'error'

A `Query` instance emits an `error` event whenever a non-fatal error occurs; e.g., an invalid value is assigned to an attribute, HTTP response errors, etc. To capture `errors`,

``` javascript
function onError( evt ) {
	console.error( evt );
}

query.on( 'error', onError );
```

#### 'init'

A `Query` instance emits an `init` event prior to querying a Github endpoint. Each query is assigned a unique identifier, which is emitted during this event.

``` javascript
function onInit( evt ) {
	console.log( evt.qid );
}

query.on( 'init', onInit );
```

Listening on this event could be useful for query monitoring.


#### 'request'

A `Query` instance emits a `request` event when making an HTTP request to a Github endpoint. If `query.all` is `true`, a single query could be comprised of multiple requests. Each request will result in a `request` event.

``` javascript
function onRequest( evt ) {
	console.log( evt );
}

query.on( 'request', onRequest );
```

For paginated queries, each request maps to a particular page. The page identifier is specified by a request id `rid`.


#### 'page'

A `Query` instance emits a `page` event upon receiving a paginated response.

``` javascript
function onPage( evt ) {
	console.log( 'Request id: %d.', evt.rid );
	console.log( 'Page number: %d.', evt.page );
	console.log( 'Page %d of %d.', evt.count, evt.total );
	console.log( evt.data );
}

query.on( 'page', onPage );
```


#### 'data'

A `Query` instance emits a `data` event after processing all query data. For queries involving pagination, all data is concatenated into a single `array`.

``` javascript
function onData( evt ) {
	console.log( evt.data );
}

query.on( 'data', onData );
```



#### 'end'

A `Query` instance emits an `end` event once a query is finished processing all requests. Of interest, the emitted event includes [rate limit](https://developer.github.com/v3/rate_limit/) information, which could be useful for throttling queries.

``` javascript
function onEnd( evt ) {
	console.log( 'Rate limit info...' );
	console.dir( evt.ratelimit );
}

query.on( 'end', onEnd );
```


#### 'pending'

A `Query` instance emits a `pending` event anytime the number of pending requests changes. Listening to this event could be useful when wanting to gracefully end a `Query` instance (e.g., allow all pending requests to finish before killing a process).

``` javascript
function onPending( count ) {
	console.log( '%d pending requests...', count );
}

query.on( 'pending', onPending );
```


#### 'start'

A `Query` instance emits a `start` event immediately before creating a new interval timer and starting to poll a Github API endpoint.

``` javascript
function onStart() {
	console.log( 'Polling has begun...' );
}

query.on( 'start', onStart );
```


#### 'stop'

A `Query` instance emits a `stop` event when it stops polling a Github API endpoint.

``` javascript
function onStop() {
	console.log( 'Polling has ended...' );
}

query.on( 'stop', onStop );
```

__Note__: pending requests may result in `data` and other associated events being emitted __after__ a `stop` event occurs.




---
## Examples

``` javascript
var createQuery = require( '@kgryte/github-get' );

var opts = {
	'uri': 'https://api.github.com/user/repos',
	'headers': {
		'User-Agent': 'my-unique-agent',
		'Accept': 'application/vnd.github.moondragon+json',
		'Authorization': 'token tkjorjk34ek3nj4!'
	},
	'qs': {
		'page': 1,
		'per_page': 100
	},
	'all': true,
	'interval': 10000 // every 10 seconds
};

function onError( evt ) {
	console.error( evt );
}

function onRequest( evt ) {
	console.log( evt );
}

function onPage( evt ) {
	var pct = evt.count / evt.total * 100;
	console.log( 'Query %d progress: %d%.' , evt.qid, Math.round( pct ) );
}

function onData( evt ) {
	console.log( evt.data );
}

function onEnd( evt ) {
	console.log( 'Query %d ended...', evt.qid );
	console.dir( evt.ratelimit );
}

var query = createQuery( opts );
query.on( 'error', onError );
query.on( 'request', onRequest );
query.on( 'page', onPage );
query.on( 'data', onData );
query.on( 'end', onEnd );

// Stop polling after 60 seconds...
setTimeout( function stop() {
	query.stop();
}, 60000 );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```

__Note__: in order to run the example, you will need to obtain a personal access [token](https://github.com/settings/tokens/new) and modify the `Authorization` header accordingly.



---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g @kgryte/github-get
```


### Usage

``` bash
Usage: github-get [options] uri

Options:

  -h,    --help                Print this message.
  -V,    --version             Print the package version.
         --uri uri             Github URI.
         --token token         Github personal access token.
         --accept media_type   Github media type.
         --all                 Fetch all pages.
         --interval ms         Poll interval (in milliseconds).
```

### Notes

*	In addition to the command-line `token` option, the token may also be specified by a `GITHUB_TOKEN` environment variable. The command-line option __always__ takes precedence.
*	If the process receives a terminating [signal event](https://nodejs.org/api/process.html#process_signal_events) (e.g., `CTRL+C`) while polling a Github API endpoint, the process will stop polling and wait for any pending requests to complete before exiting.


### Examples

Setting the personal access [token](https://github.com/settings/tokens/new) using the command-line option:

``` bash
$ github-get --token <token> --accept 'application/vnd.github.moondragon+json' --all 'https://api.github.com/user/repos'
# => '[{..},{..},...]'
```

Setting the personal access [token](https://github.com/settings/tokens/new) using an environment variable:

``` bash
$ GITHUB_TOKEN=<token> github-get --accept 'application/vnd.github.moondragon+json' --all 'https://api.github.com/user/repos'
# => '[{...},{...},...]'
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ ./node_modules/.bin/github-get --token <token> 'https://api.github.com/user/repos'
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ node ./bin/cli --token <token> 'https://api.github.com/user/repos'
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/@kgryte/github-get.svg
[npm-url]: https://npmjs.org/package/@kgryte/github-get

[travis-image]: http://img.shields.io/travis/kgryte/github-get/master.svg
[travis-url]: https://travis-ci.org/kgryte/github-get

[coveralls-image]: https://img.shields.io/coveralls/kgryte/github-get/master.svg
[coveralls-url]: https://coveralls.io/r/kgryte/github-get?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/github-get.svg
[dependencies-url]: https://david-dm.org/kgryte/github-get

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/github-get.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/github-get

[github-issues-image]: http://img.shields.io/github/issues/kgryte/github-get.svg
[github-issues-url]: https://github.com/kgryte/github-get/issues
