var http = require('http');
//var _ = require('underscore');
//var config = require('config');
var querystring = require('querystring');

// https://nodejs.org/api/http.html#http_http_request_options_callback

function ServiceHelper() {

}

ServiceHelper.prototype.Invoke = function() {
	
}

ServiceHelper.prototype.get = function(endpoint, data, callback) {
	endpoint += '?' + querystring.stringify(data);
	tryInvoke(subUrl, 'GET', {}, callback);
}

ServiceHelper.prototype.tryInvoke = function(
	host, port, endpoint, method, data, callback) {
	var dataString = JSON.stringify(data);
	var headers = {};

	if (method == 'GET') {
		endpoint += '?' + querystring.stringify(data);
	} else {
		headers = {
		'Content-Type': 'application/json',
		'Content-Length': dataString.length
		};
	}
	
	var options = {
        host: host,
        port: port,
		path: endpoint,
		method: method,
		headers: headers
	};

    var req = http.request(options, function(res) {
		res.setEncoding('utf-8');
		var responseString = '';
		
		res.on('data', function(data) {
			responseString += data;
		});
		
		res.on('end', function() {
			console.log(responseString);
			var responseObject = JSON.parse(responseString);
			callback(null, responseObject);
		});
	});
	
	req.on('error', function(error) {
		console.log('problem with request: ' + error.message);
		callback(error);
	});
	
	req.write(dataString);
	
	// always call req.end() to signify that we're done with the 
	// request even if there is no dta being written to the 
	// request body.
	req.end();
}

module.exports = ServiceHelper;