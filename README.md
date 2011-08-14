# node-curl
  
 node-curl is a port of libcurl to node.js. Its interface emulates the
 `http` module of node.js. 

 But in contrast to `http` module's asynchronous functions, node-curl
 provides the equivalent synchronous APIs.

## Build
  
    node-waf configure && node-waf build

## APIs

### curl.request (options)
 
 Options:

 - `url`        The url to GET/POST, such as "http://host:80/index.php", just like what you input in the browser.
 - `method`     `GET` or `POST`
 - `useragent`  The User Agent string

 Example

```javascript
var req = curl.request ({
    url: "http://cnodejs.org",
    method: "GET"
});
```

### curl.get ([options | url])

 It's equivalent to `curl.request` but the method is default to `GET`.

 And you can have

```javascript
var req = curl.get ({ url : "http://cnodejs.org"});
```

 Or just straight forward

```javascript
var req = curl.get ("http://cnodejs.org");
```

### request.write (data)
 
 Write string to the request.

### request.end ([data])

 Send the request and get response.

 Example

```javascript
var req = curl.request ({
    url: "http://cnodejs.org",
    method: "POST"
});
req.write ("Some text\n");
req.write ("another text");
console.log (req.end ());
```
