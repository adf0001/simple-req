
// form string tool
module.exports = function (obj) {
	var a = [];
	for (var i in obj) {
		a[a.length] = encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
	}
	return a.join("&");
}
