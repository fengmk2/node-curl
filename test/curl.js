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
      homeurl += app.address().port;
      done();
    });
  });

  describe('request()', function () {
    it('should throw error', function () {
      (function () {
        var req = httpsync.request();
      }).should.throw('Bad arguments');
      (function () {
        var req = httpsync.request(1, 2);
      }).should.throw('Bad arguments');
      (function () {
        var req = httpsync.request(1);
      }).should.throw('Bad arguments');
      (function () {
        var req = httpsync.request('foo');
      }).should.throw('Bad arguments');
      (function () {
        var req = httpsync.request({});
        req.end();
      }).should.throw('Couldn\'t resolve host name');
      (function () {
        var req = httpsync.request({
          url: 'http://www.notExistsHostName.com/'
        });
        req.end();
      }).should.throw('Couldn\'t resolve host name');
    });

    // it('should GET / return status 200', function () {
    //   var req = httpsync.get(homeurl);
    //   var res = req.end();
    //   res.should.status(200);
    // });
  });

  describe('get()', function () {
    it('should throw error', function () {
      (function () {
        var req = httpsync.get();
      }).should.throw('Bad arguments');
      (function () {
        var req = httpsync.get(1);
      }).should.throw('Bad arguments');
      (function () {
        var req = httpsync.get('foo', {});
      }).should.throw('Bad arguments');
      (function () {
        var req = httpsync.get({});
        req.end();
      }).should.throw('Couldn\'t resolve host name');
      (function () {
        var req = httpsync.get({
          url: 'http://www.notExistsHostName.com/'
        });
        req.end();
      }).should.throw('Couldn\'t resolve host name');
    });

    it('should GET / return status 200 using normal http module', function (done) {
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
