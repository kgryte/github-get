TODO
==== 	

1. Consider support for additional `headers`.
	-	e.g., in `./lib/headers.js`, setting `out = opts.headers || {}`.
2. revisit when `total = 1`
	-	 ensure always returning an `array`
3. revisit error cases and subsequent response handling
	-	maybe wait to return the `error` to the callback until all requests have returned
		-	yes, as this allows any rate limit info to be resolved
4. 
5. handle case where `last_page='last'` and yet `total=1`.
	-	will it have a link header or no? If no, then may be already handled
6. in `done()`, log the number of results (flattened `Array#length`)
7. 