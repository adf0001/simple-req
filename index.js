
var req_by_node = require("./req-by-node");
var req_by_browser = require("./req-by-browser");

module.exports = function (requestOptions, requestData, cb) {
	if (typeof XMLHttpRequest !== "undefined") {
		return req_by_browser(requestOptions, requestData, cb);
	}
	else {
		return req_by_node(requestOptions, requestData, cb);
	}
}
