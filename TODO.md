TODO
====

1. 	Class or an event-emitter?
	-	how to provide poll progress?
		-	number of open requests?
		-	failed requests?
		-	could be used to allow graceful exit
			-	e.g., wait for all open requests to return before exit
	- 	return a `Query` class, which is also an event-emitter
		- events
			-	request
			-	page
			-	data
			-	error
			-	start
			-	stop
			-	end
			-	init
2. 	
