var serviceConfig = require('./config');
var ServiceHelper = require('./serviceHelper');
var math = require('mathjs');
var moment = require('moment');
var microtime = require('microtime-nodejs');
var node_hash = require('node_hash');
var serviceHelper = new ServiceHelper();

var const_precision = 14;

var user;
var passwordExpired;

function TableSafeUserProvider() {

}

TableSafeUserProvider.prototype.authenticateUser = function (username, password, callback) {
    passwordExpired = false;

    var results = {};
    var host = serviceConfig.base_url;
    var port = serviceConfig.port;
    var endpoint = serviceConfig.service_path + '/user/login';
    var data = {
        'userName' : username,
        'password' : password
    };
    
    // Make call to Viableware API to validate credentials. The API will
    // issue at 401 response, which causes an exception in the Guzzle library,
    // so the request is wrapped in a try/catch block.
    serviceHelper.tryInvoke(
        host, port, endpoint, 'POST', 
        { 'includeCompanies' : 'true' }, data, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                // Receiving a response indicates success. Use the returned parameters
                // to set the user's session details.
                console.log(res);

                // Check the user's password expiration date
                var now = moment();
                var expireDate = moment(res['pwdExpiration']);
                if (now.isAfter(expireDate)) {
                    passwordExpired = true;
                    results.status = 'fail';
                    callback(results, null);
                    return;
                };
                
                var time = math.round(microtime.nowDouble() * 1000, const_precision);
                var tokenSeed = res['tokenSeed'];
                var token = node_hash.sha256(tokenSeed + time);

                results.status = 'success';
                results.id = res['id'];
                results.username = username;
                results.token = token;
                results.time = time;
                //results.remember_token = ?;
                results.password_expiration = res['pwdExpiration'];

                if (res['companies'] != null) {
                    // Payload Companies
                    results.payload_companies = res['companies'];

                    // Find user Companies
                    //var userCompanies = 
                };

            }
    });
}

module.exports = TableSafeUserProvider;