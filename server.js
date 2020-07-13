'use strict';


var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new (nodeStatic.Server)('./dist', { cache: false });
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
  console.log("running on localhost:8889")
}).listen(8889, "localhost");




