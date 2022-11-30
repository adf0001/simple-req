
var simple_req_by_node = require("./simple-req-by-node");
var simple_req_by_browser = require("./simple-req-by-browser");

module.exports = function (requestOptions, requestData, cb) {
	if (typeof XMLHttpRequest !== "undefined") {
		return simple_req_by_browser(requestOptions, requestData, cb);
	}
	else {
		return simple_req_by_node(requestOptions, requestData, cb);
	}
}
