/*!
 * httpsync - node-curl.node test
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var httpsync = require('../');
var should = require('should');
var echo = require('./support/echo');

describe('curl.js', function () {

  var app = echo.create();
  var homeurl = 'http://127.0.0.1:';
  before(function (done) {
    app.listen(0, function () {
      console.log(app.address());
      homeurl += app.address().port;
      done();
    });
  });

  describe('get()', function () {
    it('should GET / return status 200', function (done) {
      require('http').get(homeurl, function (res) {
        res.should.status(200);
        done();
      });
    });

    it('should GET / return status 200', function () {
      var req = httpsync.get(homeurl);
      var res = req.end();
      res.should.status(200);
    });
  });

});
