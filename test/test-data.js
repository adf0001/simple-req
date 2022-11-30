
//global variable, for html page, refer tpsvr @ npm.
simple_req = require("../index.js");

module.exports = {

	"try-tpsvr": function (done) {
		simple_req(
			//connect to tpsvr-long-poll
			{ host: 'localhost', port: 8060, path: '/?cmd=getLongPollState&current=1', method: 'GET' },
			null,
			(err, result) => {
				console.log(err, result?.body?.slice(0, 40), typeof result?.body, result?.json);
				done(err && !result?.body);
			}
		);
	},

	".url": function (done) {
		simple_req(
			//connect to tpsvr-long-poll
			{ url: 'http://localhost:8060/?cmd=getLongPollState&current=1', method: 'GET' },
			null,
			(err, result) => {
				console.log(err, result?.body?.slice(0, 40), typeof result?.body, result?.json);
				done(err && !result?.body);
			}
		);
	},

	".form": function (done) {
		simple_req(
			{ url: 'http://httpbin.org/post', method: 'POST', form: true },
			{ a: 123 },
			(err, result) => {
				console.log(err, "body-", result?.body?.slice(0, 40), typeof result?.body, "json-", result?.json);
				//console.log(result);
				done(err && !result?.body);
			}
		);
	},

	"error-host": function (done) {
		simple_req(
			{ host: 'fjaskldjfhapeqrcfsd.com', path: '/lskfnjalskdfj', method: 'GET' },
			null,
			(err, result) => {
				console.log(err?.message || err, result?.body, result?.json);
				done(!err);
			}
		);
	},

	"error-timeout": function (done) {
		simple_req(
			//connect to tpsvr-long-poll
			{
				host: 'localhost', port: 8060, path: '/?cmd=getLongPollState', method: 'GET',
				timeout: 1001, dataTimeout: 1002,
			},
			null,
			(err, result) => {
				console.log(err?.message || err, result?.body, result?.json);
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
