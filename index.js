
var node_request = require("./lib/node-request");
var browser_request = require("./lib/browser-request");

module.exports = function (requestOptions, requestData, cb) {
	if (typeof XMLHttpRequest !== "undefined") {
		return browser_request(requestOptions, requestData, cb);
	}
	else {
		return node_request(requestOptions, requestData, cb);
	}
}
