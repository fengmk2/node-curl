/*!
 * httpsync - test.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var httpsync = require('../');
var http = require('http');

var app = http.createServer(function (req, res) {
  console.log(req.url, req.headers);
  req.on('end', function () {
    res.end('hello world');
  });
});

app.listen(0, function () {
  var url = 'http://127.0.0.1:' + app.address().port;
  console.log('start to request: ' + url);
  var req = httpsync.get(url);
  var res = req.end();
  console.log(res);
  process.exit(0);
});
