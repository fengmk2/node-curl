require("http").createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(req.method + "\n");

  var data = "";
  req.on("data", function(chunk) {
      data += chunk;
  });
  req.on("end", function(chunk) {
      res.end(data);
  });
}).listen(9000);
