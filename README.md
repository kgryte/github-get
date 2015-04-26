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
var get = require( '@kgryte/github-get' );
```

#### get( opts, clbk )

Retrieves resources from a [Github API](https://developer.github.com/v3/) endpoint.

``` javascript
var opts = {
	'uri': 'https://api.github.com/user/repos'	
};

get( opts, onResponse );

function onResponse( error, json ) {
	if ( error ) {
		console.error( error );
		return;
	}
	console.log( json );
}
```

The `function` accepts the standard [request](https://github.com/request/request) options. Additional options are as follows:

-	__all__: `boolean` indicating if all paginated results should be returned from the endpoint. By default, Github paginates results. Setting this option to `true` instructs the `function` to continue making requests until __all__ pages have been returned. Default: `false`.

The provided `callback` should accept an `error` object and a JSON `array`. For a successful request, `error` is `null`; otherwise, `error` is structured as follows:

``` javascript
{
	"status": <Number>,
	"message": <String>,
	"detail": <String|Error>
}
```


## Examples

``` javascript
var get = require( '@kgryte/github-get' );

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
	'all': true
};

get( opts, onResponse );

function onResponse( error, body ) {
	if ( error ) {
		console.error( error );
		return;
	}
	console.log( body );
}
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
```

### Notes

*	In addition to the command-line `token` option, the token may also be set with a `GITHUB_TOKEN` environment variable. The command-line option __always__ takes precedence.


### Examples

``` bash
$ github-get --token <token> --accept 'application/vnd.github.moondragon+json' --all 'https://api.github.com/user/repos'

$ GITHUB_TOKEN=<token> github-get --accept 'application/vnd.github.moondragon+json' --all 'https://api.github.com/user/repos'
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
