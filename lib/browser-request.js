
var parse_headers = require("./parse-headers");
var to_form_string = require("./to-form-string");

/*
browserRequest(requestOptions, requestData, cb)
	requestOptions
		// refer to node/http.request/options
		.method
			A string specifying the HTTP request method. Default: 'GET'.
		.protocol
			Protocol to use. Default: 'http:'. 
		.host
			A domain name or IP address of the server to issue the request to. Default: 'localhost'. 
		.hostname
			Alias for host.
		.port
			Port of remote server. Default: none.
		.path
			Request path. Should include query string if any. E.G. '/index.html?page=12'. Default: "/".
		.auth
			Basic authentication i.e. 'user:password' to compute an Authorization header. 
		.timeout
			A number specifying the socket timeout in milliseconds.
			This will set the timeout before the data sending start.

		// extra
		.dataTimeout
			A number specifying the timeout in milliseconds after the socket is connected.
			* Not work on some browsers, just use the .timeout.
		.url
			A url string.
		.form
			set true if requestData is a form data object.

	requestData
		request body text, or json object, or null,
		or a form data object when requestOptions.form is true.
	
	cb
		function( error, result= { res, body [, json] } )
			res
				// refer to node/http.IncomingMessage
				.statusCode
					The 3-digit HTTP response status code. E.G. 404.
				.statusMessage
					The HTTP response status message (reason phrase). E.G. OK or Internal Server Error.
				.headers
					The request/response headers object.
					Key-value pairs of header names and values. Header names are lower-cased.
	
*/
function browserRequest(requestOptions, requestData, cb) {
	//arguments
	var url = requestOptions.url ||
		(
			(requestOptions.protocol || 'http:') + "//" +
			(requestOptions.host || requestOptions.hostname || 'localhost') +
			(requestOptions.port ? (":" + requestOptions.port) : "") +
			"/" + (requestOptions.path?.replace?.(/^[\/\\]+/, "") || "")
		);

	var auth = [];
	if (requestOptions.auth) {
		var i = requestOptions.auth.indexOf(":");
		if (i >= 0) {
			auth[0] = requestOptions.auth.slice(0, i);
			auth[1] = requestOptions.auth.slice(i + 1);
		}
	}

	//cleanup
	var tmid, tmidData;
	var cleanup = function (keep) {
		if (tmid) { clearTimeout(tmid); tmid = null; };
		if (!keep) cb = null; 	//callback only once
	}

	// request
	var req = new XMLHttpRequest();

	req.open(requestOptions.method, url, true, ...auth);

	//state
	var lastReadyState = 0;
	req.onreadystatechange = function () {
		if (req.readyState === 4 || (req.readyState === 0 && lastReadyState)) {	//DONE, or UNSENT by abort
			/*
			check abnormal DONE, such as ERR_NAME_NOT_RESOLVED from req.send(),
				which can't be catched anywhere in browser/chrome by its design.
			https://stackoverflow.com/questions/33569559/xmlhttprequest-neterr-name-not-resolved
			*/
			if (req.readyState === 4 && (lastReadyState === 0 || lastReadyState === 1) &&
				req.status === 0 && !req.statusText && !req.responseText) {
				cb?.(Error("abnormal request state"));
				cleanup();
				return;
			}

			var res = {
				statusCode: req.status,
				statusMessage: req.statusText,
				headers: parse_headers(req.getAllResponseHeaders()),
			};

			var result = { res, body: req.responseText };
			try { result.json = JSON.parse(result.body) } catch (ex) { }

			cb?.(null, result);

			cleanup();
		}
		else if (req.readyState === 3) {	// Receiving
			if (!tmidData) {
				if (tmid) cleanup(true);
				if (requestOptions.dataTimeout > 0) {
					// timer for data
					tmid = setTimeout(
						() => {
							cb?.(Error("data timeout, " + requestOptions.dataTimeout));
							tmid = null;
							cleanup();
							req.abort();
						},
						requestOptions.dataTimeout
					);
				}
				tmidData = true;
			}
		}
		lastReadyState = req.readyState;
	}

	//timer for connection
	if (requestOptions.timeout > 0) {
		tmid = setTimeout(
			() => {
				cb?.(Error("connection timeout, " + requestOptions.timeout));
				tmid = null;
				cleanup();
				req.abort();
			},
			requestOptions.timeout
		);
	}

	//header
	var hasContentType;
	if (requestOptions.headers) {
		for (var i in requestOptions.headers) {
			req.setRequestHeader(i, requestOptions.headers[i]);
			if (i.toLowerCase() === "content-type") hasContentType = true;
		}
	}

	if (requestData) {
		var isText = typeof requestData === "string";
		if (!hasContentType) {
			req.setRequestHeader("content-type",
				(isText || requestOptions.form) ? "application/x-www-form-urlencoded" : "application/json");
		}
		if (!isText) {
			requestData = requestOptions.form ? to_form_string(requestData) : JSON.stringify(requestData);
		}
	}

	req.send(requestData);

	return req;
}

// module exports
module.exports = browserRequest;
