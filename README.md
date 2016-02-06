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


#### request( opts, clbk )




---
## Examples

``` javascript
var request = require( '@kgryte/github-get' );

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
Usage: ghget [options] 

Options:

  -h,  --help               Print this message.
  -V,  --version            Print the package version.
       --protocol protocol  Request protocol. Default: https.
       --hostname host      Hostname. Default: api.github.com.
  -p,  --port port          Port. Default: 443 (https) or 80 (http).
       --path path          Resource path. Default: '/'.
       --token token        Github personal access token.
       --accept media_type  Media type. Default: application/vnd.github.v3+json.
  -ua, --useragent ua       User-agent.
       --page page          Resource page. Default: 1.
       --last_page page     Last resource page to resolve. Default: last.
       --per_page size      Page size. Default: 100.
```

### Notes

*	In addition to the command-line [`token`][github-token] option, the token may also be specified by a [`GITHUB_TOKEN`][github-token] environment variable. The command-line option __always__ takes precedence.
*	Request resources are written to `stdout`.
*	Rate limit information is written to `stderr`.


### Examples

Setting the personal access [token][github-token] using the command-line option:

``` bash
$ DEBUG=* ghget --token <token> --path '/user/repos'
# => '[{..},{..},...]'
```

Setting the personal access [token][github-token] using an environment variable:

``` bash
$ DEBUG=* GITHUB_TOKEN=<token> ghget --path '/user/repos'
# => '[{...},{...},...]'
```

For local installations, modify the command to point to the local installation directory; e.g., 

``` bash
$ DEBUG=* ./node_modules/.bin/ghget --token <token> --path '/user/repos'
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ DEBUG=* node ./bin/cli --token <token> --path '/user/repos'
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

[github-api]: https://developer.github.com/v3/
[github-token]: https://github.com/settings/tokens/new
[github-pagination]: https://developer.github.com/guides/traversing-with-pagination/
[github-rate-limit]: https://developer.github.com/v3/rate_limit/