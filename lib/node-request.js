
var http = require("http");

/*
nodeRequest(requestOptions, requestData, cb)
	requestOptions
		...
			refer to node/http.request/options
			
		.dataTimeout
			A number specifying the timeout in milliseconds after the socket is connected.

		.url
			A url string.

	requestData
		request body text, or json, or null
	
	cb
		function( error, result= { res, body [, json] } )
*/
function nodeRequest(requestOptions, requestData, cb) {
	var arg = [requestOptions.url, requestOptions];
	if (!arg[0]) arg.shift();

	var req = http.request(
		...arg,
		function (res) {
			//cleanup
			var tmid;
			var cleanup = () => {
				if (tmid) { clearTimeout(tmid); tmid = null; };
				//call only once
				cb = null;
			}

			//to get body
			var body = "";
			res.on("data", (buffer) => { body += buffer.toString(); });
			res.on("end", () => {
				var result = { res, body };
				try { result.json = JSON.parse(body) } catch (ex) { }
				cb?.(null, result);
				cleanup();
			});

			//timer for data
			if (requestOptions.dataTimeout > 0) {
				tmid = setTimeout(
					() => {
						cb?.(Error("data timeout, " + requestOptions.dataTimeout), { res, body });
						tmid = null;
						cleanup();
						req.abort();
					},
					requestOptions.dataTimeout
				);
			}
		}
	);

	req.on('error', (err) => { cb?.(err); });

	if (requestData) {
		var isText = typeof requestData === "string";
		if (!req.getHeader("CONTENT-TYPE"))
			req.setHeader("CONTENT-TYPE", isText ? "application/x-www-form-urlencoded" : "application/json");
		req.write(isText ? requestData : JSON.stringify(requestData));
	}
	req.end();
}

// module exports
module.exports = nodeRequest;
