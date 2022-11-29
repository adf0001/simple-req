
var nodeRequest = require("./lib/node-request");

module.exports = function (requestOptions, requestData, cb) {
	return nodeRequest(requestOptions, requestData, cb);
}
