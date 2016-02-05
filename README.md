Github Get
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> Retrieves resources from a [Github API][github-api] endpoint.


## Installation

``` bash
$ npm install @kgryte/github-get
```


## Usage

``` javascript
var request = require( '@kgryte/github-get' );
```


#### request( opts[, clbk] )

Returns a `request` instance which fetches resources from a [Github API][github-api] endpoint.

``` javascript
var opts;
var req;

opts = {
	'uri': 'https://api.github.com/user/repos?page=1&per_page=100'	
};

req = request( opts, onResponse );
req.on( 'error', onError );

function onError( error ) {
	throw error;
}

function onResponse( response ) {
	response.on( 'data', onData );
	response.on( 'end', onEnd );
}

function onData( data ) {
	console.log( data );
	// returns [{...},{...},...]
}

function onEnd( evt ) {
	console.log( evt );
	// returns {...}
}
```

The `function` accepts the standard [request][http-request] options. The `function` also accepts the following additional `options`:

-	__all__: `boolean` indicating if all [paginated][github-pagination] results should be resolved from an endpoint. By default, Github [paginates][github-pagination] results. Setting this option to `true` specifies that __all__ pages should be resolved. Default: `false`.


---
## Request

### Attributes

A `request` instance has the following attributes...


#### req.pending

__Read-only__ attribute providing the number of pending API [page][github-pagination] requests.

``` javascript
if ( req.pending ) {
	console.log( '%d page requests still pending...', req.pending );
}
```


===
### Events

A `request` instance emits the following events...


#### 'error'

A `request` instance emits an `error` event whenever a request error occurs. To capture `errors`,

``` javascript
function onError( evt ) {
	console.error( evt );
}

req.on( 'error', onError );
```

An `error` event has the following properties:

*	__beep__:
*	__boop__:

If an `error` handler is not registered, any encountered `errors` will be thrown.


#### 'query'

A `request` instance emits a `query` event when making an HTTP request to a Github endpoint. If `opts.all` is `true`, a single request could be comprised of multiple queries. Each query will result in a `query` event.

``` javascript
function onQuery( evt ) {
	console.log( evt );
}

req.on( 'query', onQuery );
```

A `query` event has the following properties:

*	__beep__:
*	__boop__: 

For [paginated][github-pagination] queries, each query maps to a particular page. The page identifier is specified by a query id `evt.qid`.


#### 'pending'

A `request` instance emits a `pending` event anytime the number of pending queries changes. Listening to this event could be useful when wanting to gracefully end a process (e.g., allow all pending queries to finish before termination).

``` javascript
function onPending( count ) {
	console.log( '%d pending requests...', count );
}

req.on( 'pending', onPending );
```



#### 'response'

A `request` instance emits a `response` event upon successfully receiving an API response.

``` javascript
function onResponse( response ) {
	response.on( 'data', onData );
	response.on( 'end', onEnd );
}

function onData( data ) {
	console.log( data );
}

function onEnd( evt ) {
	console.log( evt );
}

req.on( 'response', onResponse );
```

A `response` is itself an event emitter, as documented [below](#response).


---
<a name="response"></a>
## Response

### Events

A `response` instance emits the following events...


#### 'page'

A `response` instance emits a `page` event upon receiving a [paginated][github-pagination] response.

``` javascript
function onPage( evt ) {
	console.log( 'Query id: %d.', evt.qid );
	console.log( 'Page number: %d.', evt.page );
	console.log( 'Page %d of %d.', evt.count, evt.total );
	console.log( evt.data );
}

response.on( 'page', onPage );
```

A `page` event has the following properties:

*	__beep__:
*	__boop__:


#### 'data'

A `response` instance emits a `data` event after processing all `request` data. For `requests` involving [pagination][github-pagination], all data is concatenated into a single [JSON][json] `array`.

``` javascript
function onData( json ) {
	console.log( json );
}

response.on( 'data', onData );
```


#### 'end'

A `response` instance emits an `end` event once a `request` is finished resolving all queries. Of interest, the emitted event includes [rate limit][github-rate-limit] information, which could be useful for throttling multiple `requests`.

``` javascript
function onEnd( evt ) {
	console.log( 'Rate limit info...' );
	console.dir( evt.ratelimit );
}

response.on( 'end', onEnd );
```

An `end` event has the following properties:

*	__beep__:
*	__boop__:


---
## Examples

``` javascript
var request = require( '@kgryte/github-get' );

var opts;
var req;

opts = {
	'uri': 'https://api.github.com/user/repos?page=1&per_page=100',
	'headers': {
		'User-Agent': 'my-unique-agent',
		'Accept': 'application/vnd.github.moondragon+json',
		'Authorization': 'token tkjorjk34ek3nj4!'
	},
	'all': true
};

req = request( opts, onResponse );
req.on( 'error', onError );

function onError( error ) {
	throw error;
}

function onResponse( response ) {
	response.on( 'data', onData );
	response.on( 'end', onEnd );
}

function onData( data ) {
	console.log( data );
	// returns [{...},{...},...]
}

function onEnd( evt ) {
	console.log( evt );
	// returns {...}
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```

__Note__: in order to run the example, you will need to obtain a personal access [token][github-token] and modify the `Authorization` header accordingly.



---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g @kgryte/github-get
```


### Usage

``` bash
Usage: ghget [options] (uri | --uri uri)

Options:

  -h,    --help                Print this message.
  -V,    --version             Print the package version.
         --uri uri             Github URI.
         --token token         Github personal access token.
         --accept media_type   Github media type.
         --all                 Fetch all pages.
```

### Notes

*	In addition to the command-line [`token`][github-token] option, the token may also be specified by a [`GITHUB_TOKEN`][github-token] environment variable. The command-line option __always__ takes precedence.


### Examples

Setting the personal access [token][github-token] using the command-line option:

``` bash
$ DEBUG=* ghget --token <token> --accept 'application/vnd.github.moondragon+json' --all 'https://api.github.com/user/repos'
# => '[{..},{..},...]'
```

Setting the personal access [token][github-token] using an environment variable:

``` bash
$ DEBUG=* GITHUB_TOKEN=<token> ghget --accept 'application/vnd.github.moondragon+json' --all 'https://api.github.com/user/repos'
# => '[{...},{...},...]'
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ DEBUG=* ./node_modules/.bin/ghget --token <token> 'https://api.github.com/user/repos'
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ DEBUG=* node ./bin/cli --token <token> 'https://api.github.com/user/repos'
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


## Copyright

Copyright &copy; 2015-2016. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/@kgryte/github-get.svg
[npm-url]: https://npmjs.org/package/@kgryte/github-get

[build-image]: http://img.shields.io/travis/kgryte/github-get/master.svg
[build-url]: https://travis-ci.org/kgryte/github-get

[coverage-image]: https://img.shields.io/codecov/c/github/kgryte/github-get/master.svg
[coverage-url]: https://codecov.io/github/kgryte/github-get?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/github-get.svg
[dependencies-url]: https://david-dm.org/kgryte/github-get

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/github-get.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/github-get

[github-issues-image]: http://img.shields.io/github/issues/kgryte/github-get.svg
[github-issues-url]: https://github.com/kgryte/github-get/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[http-request]: https://nodejs.org/api/http.html#http_http_request_options_callback
[github-api]: https://developer.github.com/v3/
[github-token]: https://github.com/settings/tokens/new
[github-pagination]: https://developer.github.com/guides/traversing-with-pagination/
[github-rate-limit]: https://developer.github.com/v3/rate_limit/