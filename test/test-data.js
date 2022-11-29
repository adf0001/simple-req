
//global variable, for html page, refer tpsvr @ npm.
simple_req = require("../index.js");

module.exports = {

	"text": function (done) {
		simple_req(
			{ host: 'myip.ipip.net', method: 'GET' },
			null,
			(err, result) => {
				console.log(err, result?.body, result?.json);
				done(err && !result?.body);
			}
		);
	},

	"json": function (done) {
		simple_req(
			{ host: 'myip.ipip.net', path: '/json', method: 'GET' },
			null,
			(err, result) => {
				console.log(err, result?.body, result?.json);
				done(err && !result?.body);
			}
		);
	},

	"try-tpsvr": function (done) {
		simple_req(
			//connect to tpsvr-long-poll
			{ host: 'localhost', port: 8060, path: '/?cmd=getLongPollState&current=1', method: 'GET' },
			null,
			(err, result) => {
				console.log(err, result?.body, typeof result?.body, result?.json);
				done(err && !result?.body);
			}
		);
	},

	"error-host": function (done) {
		simple_req(
			{ host: 'fjaskldjfhapeqrcfsd.com', path: '/lskfnjalskdfj', method: 'GET' },
			null,
			(err, result) => {
				console.log(err, result?.body, result?.json);
				done(!err);
			}
		);
	},

	"error-timeout": function (done) {
		simple_req(
			//connect to tpsvr-long-poll
			{ host: 'localhost', port: 8060, path: '/?cmd=getLongPollState', method: 'GET', dataTimeout: 1000 },
			null,
			(err, result) => {
				console.log(err, result?.body, result?.json);
				done(!err);
			}
		);
	},

	"check exports": function (done) {
		var m = simple_req;
		for (var i in m) {
			if (typeof m[i] === "undefined") { done("undefined: " + i); return; }
		}
		done(false);

		console.log(m);
		var list = "export list: " + Object.keys(m).join(", ");
		console.log(list);
		return list;
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('simple_req', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });