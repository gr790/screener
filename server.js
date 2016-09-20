"use strict";
/* global console */
var fs = require('fs');
var http = require('http');
var httpProxy = require('http-proxy');


function onError(e) {
  console.log(e);
}

function startsWith(s1, s2) {
  return (s1.length >= s2.length && s1.substr(0, s2.length) == s2);
}

/* This function will print the useful information from req recieved from browser */
function reqInfo(req) {
}

var options = {
  autoRewrite: true,
  changeOrigin: true,
  target:'http://192.168.56.102:8000'
};
var proxy = httpProxy.createProxyServer(options);
proxy.on('error', onError);

http.createServer(function(req, res) {
  reqInfo(req);
  if(req.url == '/static/bundle.js.map') {
    fs.readFile('./bundle.map.js', function(err, data) {
      res.writeHead(200);
      res.end(data);
    });
  } else if(startsWith(req.url, '/static/bundle.')) {
    fs.readFile('./bundle.js', function(err, data) {
      res.writeHead(200);
      res.end(data);
    });
  } else if(startsWith(req.url, '/static/css/custom.')) {
    fs.readFile('./custom.css', function(err, data) {
      res.writeHead(200);
      res.end(data);
    });
  } else {
    proxy.web(req, res);
  }
}).listen(8000, '192.168.56.102'); /* My intention is to running this server on local RHEL VM */

console.log([
    "Ready to accept requests.",
    "Open: http://192.168.56.102:8000 in browser."
].join('\n'));
