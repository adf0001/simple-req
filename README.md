# simple-req
a simple http request for text content

# Install
```
npm install simple-req
```

# Usage & Api
```javascript

var simple_req = require("simple-req");
//or var simple_req = require("simple-req/req-by-node");		//only for node
//or var simple_req = require("simple-req/req-by-browser");		//only for browser

/*
simple_req(requestOptions, requestData, cb)
	requestOptions
		...
			refer to node/http.request/options
			
		.dataTimeout
			A number specifying the timeout in milliseconds after the socket is connected.

		.url
			A url string.

		.form
			set true if requestData is a form data object.

	requestData
		request body text, or json object, or null,
		or a form data object when requestOptions.form is true.
	
	cb
		function( error, result= { res, body [, json] } )
*/
simple_req(
	{ url: 'http://localhost/', method: 'GET' },
	null,
	(err, result) => {
		console.log(err, result?.body, result?.json);
	}
);

```
