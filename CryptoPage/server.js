var http = require('http');
var fs = require("fs");
var path = require("path");
var express = require("express");
var app = express();

app.use(express.static(__dirname + '/'));
var path = require('path');

var server = http.createServer(function(req, res) {
	
	var content;

	if (req.url == "/") {
		req.url ="/index.html";
		console.log("send index");
	}
	
	var extension = path.extname(req.url);
	
	console.log("Asked for ext type \""+extension+"\"");
	console.log("Asked for URL: "+req.url+";");

	var ip = req.socket.remoteAddress;
	ip = ip.replace(/^.*:/, '');
	console.log("Connection From: "+ip);

	var fileReq = req.url;

	console.log("Send File: "+req.url);
	
	try {
		
		if (extension == ".html") {
			res.writeHead(200, {'Content-Type': 'text/html'});
		} else if ( extension == ".css" ) {
			res.writeHead(200, {'Content-Type': 'text/css'});
		} else if ( extension == ".js" ) {
			res.writeHead(200, {'Content-Type': 'text/javascript'});
		} else if ( extension == "" ) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			fileReq = fileReq + ".html"
		} else {
			res.writeHead(200, {'Content-Type': 'text/plain'});
		}

		content = fs.readFileSync(__dirname + fileReq)
		
		res.write(content);
		res.end();
	} catch(err) {
		content = "<h1>404 Not Found</h1><p>Your IP is: "+ip+"</p>";
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write(content);
		res.end();
	}
	
	
});
console.log(__dirname);

server.listen(8000);