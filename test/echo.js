require("http").createServer(function (req, res) {
  if (req.method == "HEAD") {
    res.writeHead(200, {
        'Content-Type'  : 'text/plain',
        'Date'          : 'Wed, 17 Mar 2004 18 : 00 : 49 GMT',
        'Last-Modified' : 'Wed, 25 Feb 2004 22 : 37 : 23 GMT'
    });
    res.end();
    return;
  }

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(req.method + "\n");

  if (req.headers["custom"]) {
    res.write (JSON.stringify(req.headers));
  }

  var data = "";
  req.on("data", function(chunk) {
      data += chunk;
  });
  req.on("end", function(chunk) {
      res.end(data);
  });
}).listen(9000);
