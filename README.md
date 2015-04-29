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
-	__interval__: positive number defining a poll [interval](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) for repeatedly querying the Github API. The interval should be in units of `milliseconds`. If an `interval` is __not__ provided, only a single query is made to the Github API. Default: `3600000` (1hr).

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

The `Query` instance has the following attributes and methods...


##### query.all





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

function onEnd( qid ) {
	console.log( 'Query %d ended...', qid );
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
Usage: github-get [options] <uri>

Options:

  -h,    --help                Print this message.
  -V,    --version             Print the package version.
         --uri [uri]           Github URI.
         --token [token]       Github personal access token.
         --accept [media_type] Github media type.
         --all                 Fetch all pages.
         --interval [ms]       Poll interval (in milliseconds).
```

### Notes

*	In addition to the command-line `token` option, the token may also be set with a `GITHUB_TOKEN` environment variable. The command-line option __always__ takes precedence.
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
