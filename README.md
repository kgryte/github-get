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

<a name="request"></a>
#### request( [options,] clbk )

Retrieves resources from a [Github API][github-api] endpoint.

``` javascript
request( onResponse );

function onResponse( error, data, info ) {
	// Check for rate limit info...
	if ( info ) {
		console.error( 'Limit: %d', info.limit );
		console.error( 'Remaining: %d', info.remaining );
		console.error( 'Reset: %s', (new Date( info.reset*1000 )).toISOString() );
	}
	if ( error ) {
		throw error;
	}
	console.log( JSON.stringify( data ) );
	// returns <response_data>
}
```

The `function` accepts the following `options`:
*	__protocol__: request protocol. Default: `'https'`.
*	__hostname__: endpoint hostname. Default: `'api.github.com'`.
*	__port__: endpoint port. Default: `443` (https) or `80` (http).
*	__pathname__: resource [pathname][github-api]; e.g., `/user/repos`. Default: `'/'`.
*	__page__: resource [page][github-pagination]. Default: `1`.
*	__last_page__: last resource page. If provided, the `function` will use [link headers][web-links] to resolve all pages starting from `page`. Default: `1`.
*	__per_page__: page size. Default: `100`.
*	__query__: params portion of a query `string`; e.g., `beep=boop&a=b`. This should __not__ include `page` or `per_page` query params. Default: `''`.
*	__token__: Github [access token][github-token].
*	__accept__: [media type][github-media]. Default: `'application/vnd.github.moondragon+json'`.
*	__useragent__: [user agent][github-user-agent] `string`.

To specify a particular resource [endpoint][github-api], set the `pathname` option.

``` javascript
var opts = {
	'pathname': '/user/repos'
};

request( opts, onResponse );
```

To [authenticate][github-oauth2] with an endpoint, set the [`token`][github-token] option.

``` javascript
var opts = {
	'token': 'tkjorjk34ek3nj4!'
};

request( opts, onResponse );
```

By default, the `function` only requests a single [page][github-pagination] of results. To resolve multiple [pages][github-pagination], set the `last_page` option.

``` javascript
// Resolves pages 2-5...
var opts = {
	'page': 2,
	'last_page': 5
};

request( opts, onResponse );
```

To specify that all [pages][github-pagination] beginning from `page` be resolved, set the `last_page` option to `'last'`.

``` javascript
// Resolve all pages...
var opts = {
	'last_page': 'last'
};

request( opts, onResponse );
```

To specify a [user agent][github-user-agent], set the `useragent` option.

``` javascript
var opts = {
	'useragent': 'hello-github!'
};

request( opts, onResponse );
```


#### request.factory( options, clbk )

Creates a reusable `function`.

``` javascript
var opts = {
	'pathname': '/user/repos',
	'last_page': 'last',
	'token': 'tkjorjk34ek3nj4!'
};

var get = request.factory( opts, onResponse );

get();
get();
get();
// ...
```

The factory method accepts the same `options` as [`request()`](#request).


## Notes

*	If the module encounters an application-level `error` while __initially__ querying an endpoint (e.g., no network connection, malformed request, etc), that `error` is returned immediately to the provided `callback`.
*	Response data will either be an `object` or an object `array`. If multiple [pages][github-pagination] are resolved, response data is __always__ an object `array`.
* 	The `function` will honor the `last_page` option as long as the option value does __not__ exceed the maximum number of available [pages][github-pagination].
*	[Rate limit][github-rate-limit] information includes the following:
	-	__limit__: maximum number of requests a consumer is permitted to make per hour.
	-	__remaining__: number of remaining requests.
	-	__reset__: time at which the current [rate limit][github-rate-limit] window resets in [UTC seconds][unix-time].


---
## Examples

``` javascript
var request = require( '@kgryte/github-get' );

var opts = {
	'hostname': 'api.github.com',
	'pathname': '/user/repos',
	'useragent': 'my-unique-agent',
	'accept': 'application/vnd.github.moondragon+json',
	'token': 'tkjorjk34ek3nj4!',
	'last_page': 'last'
};

request( opts, onResponse );

function onResponse( error, data, info ) {
	if ( info ) {
		console.error( info );
	}
	if ( error ) {
		throw error;
	}
	console.log( data );
}
```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```

__Note__: in order to run the example, you will need to obtain an access [token][github-token] and modify the `token` option accordingly.



---
## CLI

### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g @kgryte/github-get
```


### Usage

``` bash
Usage: ghget [options] 

Options:

  -h,  --help               Print this message.
  -V,  --version            Print the package version.
       --protocol protocol  Request protocol. Default: https.
       --hostname host      Hostname. Default: api.github.com.
  -p,  --port port          Port. Default: 443 (https) or 80 (http).
       --pathname pathname  Resource pathname. Default: '/'.
       --token token        Github access token.
       --accept media_type  Media type. Default: application/vnd.github.v3+json.
  -ua, --useragent ua       User agent.
       --page page          Resource page. Default: 1.
       --last_page page     Last resource page to resolve. Default: 1.
       --per_page size      Page size. Default: 100.
  -qs, --query querystring  Params portion of a query string. 
```

### Notes

*	In addition to the [`token`][github-token] option, the [token][github-token] may also be specified by a [`GITHUB_TOKEN`][github-token] environment variable. The command-line option __always__ takes precedence.
*	Request resources are written to `stdout`.
*	[Rate limit][github-rate-limit] information is written to `stderr`.


### Examples

Setting the access [token][github-token] using the command-line option:

``` bash
$ DEBUG=* ghget --token <token> --pathname '/user/repos'
# => '[{...},{...},...]'
```

Setting the access [token][github-token] using an environment variable:

``` bash
$ DEBUG=* GITHUB_TOKEN=<token> ghget --pathname '/user/repos'
# => '[{...},{...},...]'
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ DEBUG=* ./node_modules/.bin/ghget --token <token> --pathname '/user/repos'
# => '[{...},{...},...]'
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ DEBUG=* node ./bin/cli --token <token> --pathname '/user/repos'
# => '[{...},{...},...]'
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

[json]: http://www.json.org/
[http-request]: https://nodejs.org/api/http.html#http_http_request_options_callback
[web-links]: http://tools.ietf.org/html/rfc5988
[unix-time]: http://en.wikipedia.org/wiki/Unix_time

[github-api]: https://developer.github.com/v3/
[github-token]: https://github.com/settings/tokens/new
[github-oauth2]: https://developer.github.com/v3/#oauth2-token-sent-in-a-header
[github-media]: https://developer.github.com/v3/media/
[github-user-agent]: https://developer.github.com/v3/#user-agent-required
[github-pagination]: https://developer.github.com/guides/traversing-with-pagination/
[github-rate-limit]: https://developer.github.com/v3/rate_limit/