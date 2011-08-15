var testy = require('./lib.js');
var curl = require ("../node_curl");

//-------------------------------------------------------------------------

var request1 = new testy({
    expected : 2,
    name : 'Empty request'
});

var req = curl.request ({
    url: "http://localhost:9000"
});
var data = req.end ();

request1.assert.equal (data.data, "GET\n");
request1.assert.equal (data.statusCode, 200);
request1.finish();

//-------------------------------------------------------------------------

var request2 = new testy({
    expected : 2,
    name : 'request with GET'
});

var req = curl.request ({
    url: "http://localhost:9000",
    method: "GET"
});
var data = req.end ();

request2.assert.equal (data.data, "GET\n");
request2.assert.equal (data.statusCode, 200);
request2.finish();

//-------------------------------------------------------------------------

var request3 = new testy({
    expected : 2,
    name : 'request with GET with some data'
});

var req = curl.request ({
    url: "http://localhost:9000",
    method: "GET"
});
var data = req.end ("some data");

request3.assert.equal (data.data, "GET\n");
request3.assert.equal (data.statusCode, 200);
request3.finish();

//-------------------------------------------------------------------------

var request4 = new testy({
    expected : 2,
    name : 'request with POST'
});

var req = curl.request ({
    url: "http://localhost:9000",
    method: "POST"
});
var data = req.end ();

request4.assert.equal (data.data, "POST\n");
request4.assert.equal (data.statusCode, 200);
request4.finish();

//-------------------------------------------------------------------------

var request5 = new testy({
    expected : 2,
    name : 'request with POST with some data'
});

var req = curl.request ({
    url: "http://localhost:9000",
    method: "POST"
});
var data = req.end ("helloworld");

request5.assert.equal (data.data, "POST\nhelloworld");
request5.assert.equal (data.statusCode, 200);
request5.finish();

//-------------------------------------------------------------------------

var request6 = new testy({
    expected : 2,
    name : 'request with POST with many data'
});

var req = curl.request ({
    url: "http://localhost:9000",
    method: "POST"
});
req.write ("1 line\n");
req.write ("2 line\n");
req.write ("3 line\n");
var data = req.end ("helloworld");

request6.assert.equal (data.data, "POST\n1 line\n2 line\n3 line\nhelloworld");
request6.assert.equal (data.statusCode, 200);
request6.finish();

//-------------------------------------------------------------------------

var request7 = new testy({
    expected : 2,
    name : 'request with HEAD'
});

var req = curl.request ({
    url: "http://localhost:9000",
    method: "HEAD"
});
var data = req.end ();

request7.assert.equal (data.data, "");
request7.assert.equal (data.statusCode, 200);
request7.finish();

//-------------------------------------------------------------------------

var request8 = new testy({
    expected : 4,
    name : 'request with other heads'
});

var req1 = curl.request ({
    url: "http://localhost:9000",
    method: "PUT"
});
var data1 = req1.end ();

var req2 = curl.request ({
    url: "http://localhost:9000",
    method: "DELETE"
});
var data2 = req2.end ();

request8.assert.equal (data1.data, "PUT\n");
request8.assert.equal (data1.statusCode, 200);
request8.assert.equal (data2.data, "DELETE\n");
request8.assert.equal (data2.statusCode, 200);
request8.finish();

//-------------------------------------------------------------------------

var request9 = new testy({
    expected : 4,
    name : 'request with custom headers'
});

var req1 = curl.request ({
    url: "http://localhost:9000",
    headers: {
        "Custom": "true",
        "String": "A very very long string",
        "How": "Old are you"
    }
});
var data1 = req1.end ();

var req2 = curl.request ({
    url: "http://localhost:9000",
    method: "DELETE",
    headers: {
        "custom": "true",
        "File": "/etc/passwd",
        "Directory": "/usr"
    }
});
var data2 = req2.end ();

request9.assert.equal (data1.data, "GET\n{\"user-agent\":\"zcbenz/node-curl\",\"host\":\"localhost:9000\",\"accept\":\"*/*\",\"custom\":\"true\",\"string\":\"A very very long string\",\"how\":\"Old are you\"}");
request9.assert.equal (data1.statusCode, 200);
request9.assert.equal (data2.data, "DELETE\n{\"user-agent\":\"zcbenz/node-curl\",\"host\":\"localhost:9000\",\"accept\":\"*/*\",\"custom\":\"true\",\"file\":\"/etc/passwd\",\"directory\":\"/usr\"}");
request9.assert.equal (data2.statusCode, 200);
request9.finish();

//-------------------------------------------------------------------------

var request10 = new testy({
    expected : 1,
    name : 'response.data should be of Buffer'
});

var req = curl.request ({
    url: "http://localhost:9000"
});
var res = req.end ();

request10.assert.ok (res.data instanceof Buffer);
request10.finish();

//-------------------------------------------------------------------------

var request11 = new testy({
    expected : 1,
    name : 'write with Buffer'
});

var req = curl.request ({
    url: "http://localhost:9000",
    method: "POST",
    headers: { "nomethod": "true" }
});
var buf = new Buffer (8);
buf.writeUInt8(0x3, 0, 'big');
buf.writeUInt8(0x4, 1, 'big');
buf.writeUInt8(0x23, 2, 'big');
buf.writeUInt8(0x42, 3, 'big');
buf.writeUInt8(0x3, 4, 'little');
buf.writeUInt8(0x4, 5, 'little');
buf.writeUInt8(0x23, 6, 'little');
buf.writeUInt8(0x42, 7, 'little');
var res = req.end (buf);

request11.assert.deepEqual (res.data, buf);
request11.finish();

//-------------------------------------------------------------------------

var request12 = new testy({
    expected : 2,
    name : 'request.endFile'
});

var req = curl.request ({
    url: "http://localhost:9000"
});
var res = req.endFile (__filename);

var req2 = curl.request ({
    url: "http://localhost:9000",
    method: "POST"
});
var res2 = req2.endFile (__filename);

request12.assert.equal (res.data.toString ("utf8"),
	   	"PUT\n" + require("fs").readFileSync (__filename));
request12.assert.equal (res2.data.toString ("utf8"),
	   	"POST\n" + require("fs").readFileSync (__filename));
request12.finish();

//-------------------------------------------------------------------------

var request13 = new testy({
    expected : 2,
    name : 'check responded headers'
});

var req = curl.request ({
    url: "http://localhost:9000",
    headers: {
        "customheaders": "Test String"
    }
});
var data = req.end ();

request13.assert.equal (data.headers["customheaders"], "Test String");
request13.assert.equal (data.statusCode, 42);
request13.finish();

//-------------------------------------------------------------------------

var request14 = new testy({
    expected : 1,
    name : 'request with PUT with data'
});

var data = new Buffer('abc');
var req = curl.request ({
    url: "http://localhost:9000",
    headers: { "custom": "true" },
    method: "PUT"
});
var res = req.end (data);

request14.assert.equal ('PUT\n' + '{"user-agent":"zcbenz/node-curl","host":"localhost:9000","accept":"*/*","custom":"true","content-length":"3","expect":"100-continue"}' + 'abc', res.data);
request14.finish ();

//-------------------------------------------------------------------------

var get1 = new testy({
    expected : 2,
    name : 'Empty get'
});

var req = curl.get ({
    url: "http://localhost:9000"
});
var data = req.end ();

get1.assert.equal (data.data, "GET\n");
get1.assert.equal (data.statusCode, 200);
get1.finish ();

//-------------------------------------------------------------------------

var get2 = new testy({
    expected : 2,
    name : 'get with string option'
});

var req = curl.get ("http://localhost:9000");
var data = req.end ();

get2.assert.equal (data.data, "GET\n");
get2.assert.equal (data.statusCode, 200);
get2.finish ();

var error1 = new testy({
    expected : 1,
    name : 'should throw when reusing req after req.end'
});

//-------------------------------------------------------------------------

error1.assert.throws (
    function () {
        var req = curl.get ("http://localhost:9000");
        req.end ();
        req.end ();
    },
    "Request is already sent"
);
error1.finish ();

//-------------------------------------------------------------------------

var error2 = new testy({
    expected : 1,
    name : 'request with invalid heads'
});

error2.assert.throws (
    function () {
        var req = curl.request ({
            url: "http://localhost:9000",
            method: "FUCK"
        });
        var data = req.end ();
    },
    "Server returned nothing"
);
error2.finish ();
