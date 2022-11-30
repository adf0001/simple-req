
//parse headers string tool
module.exports = function (headerText) {
	if (typeof headerText !== "string") return headerText;

	var headers = {}, i;
	headerText.trim().split(/[\r\n]\s*/).map(
		function (v) {
			i = v.indexOf(":");
			if (i > 0) headers[v.slice(0, i).trim().toLowerCase()] = v.slice(i + 1).trim();
		}
	);
	return headers;
}
