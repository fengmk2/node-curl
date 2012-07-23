# node-curl
  
 node-curl is a port of libcurl to node.js. Its interface emulates the
 `http` module of node.js. But in contrast to `http` module's asynchronous
 functions, node-curl provides the equivalent synchronous APIs.

## Install

```bash
$ npm install httpsync
```

## Build
  
    node-waf configure && node-waf build

## APIs

### curl.request (options)
 
 Options:

 - `url`             (required) The url to GET/POST, such as "http://host:80/index.php", just like what you input in the browser.
 - `method`          `GET`, `POST` or `HEAD` or any other valid request. And even `FUCK` if your server supports it.
 - `headers`         Custom headers to be sent. 
 - `useragent`       The User Agent string
 - `timeout`         Maximum time in seconds that you allow the libcurl transfer operation to take.
 - `connectTimeout`  Maximum time in seconds that you allow the connection to the server to take.
 - `debug`           node-curl will print debug informations is set to true

 Example

```javascript
var req = curl.request({
  url: "http://cnodejs.org",
  method: "GET",
  useragent: "Ultimate Web Browser",
  headers: {
    Tag: "TGB3123",
    String: "A long string"
  }
});
```

### curl.get ([options | url])

 It's equivalent to `curl.request` but the method is default to `GET`.

 And you can have

```javascript
var req = curl.get({ url : "http://cnodejs.org"});
```

 Or just straight forward

```javascript
var req = curl.get("http://cnodejs.org");
```

### request.write (chunk)
 
 Write a chunk of data to the request. The type of data can be String or Buffer.

### request.end ([chunk])

 Send the request and get response.

 Example

```javascript
var req = curl.request({
  url: "http://cnodejs.org",
  method: "POST"
});
req.write("Some text\n");
req.write("another text");
console.log(req.end());
```

### request.endFile (filePath)

 Send a file directly. The method will default to `PUT`.

 Example

```javascript
var req = curl.request({
  url: "http://cnodejs.org",
});
req.endFile("/etc/passwd");
```

### response

 The response Object is what you get after req.end (), it has following
 fields:

 - `data`        A Buffer that stores data sent by server.
 - `headers`     Complete response headers, even contains those custom ones.
 - `ip`          IP address of the server.
 - `statusCode`  Status code that sent by server.

