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
    user = null;
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
                results.status = 'fail';
                results.err = err;
                callback(err, null);
                return;
            } else {
                // Receiving a response indicates success. Use the returned parameters
                // to set the user's session details.
                
                // The returned res is already in json format
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
                
                var mt = microtime.nowDouble();
                var time = math.round(microtime.nowDouble() * 1000);
                var tokenSeed = res['tokenSeed'];
                var token = node_hash.sha256(tokenSeed + time);

                results.status = 'success';
                results.id = res['id'];
                results.username = username;
                results.token = token;
                results.time = time;
                //results.remember_token = Hash::make(token);
                results.password_expiration = res['pwdExpiration'];
                
                // TODO : ...
                if (res['companies'] != null) {
                    // Payload Companies
                    results.payload_companies = res['companies'];

                    // Find user Companies
                    //var userCompanies = 
                }                ;

                endpoint = serviceConfig.service_path + '/user/' + username;
                serviceHelper.tryInvoke(
                    host, port, endpoint, 'GET', 
                    {
                        'x-token' : token,
                        'x-time' : time,
                        'x-username' : username,
                        'x-targetType' : 'S',
                        'x-targetId' : 0

                    }, null, function (err, userData) {
                        if (err) {
                            console.log(err);
                            results.status = 'fail';
                            results.err = err;
                            callback(err, null);
                        } else {
                            console.log(userData);

                            results.first_name = userData['firstName'];
                            results.last_name = userData['lastName'];
                            results.email = userData['email'];

                            if ((userData['authorities'] != null) 
                                && (userData['authorities'][0] != null)
                                && (userData['authorities'][0]['authority'] != null)) {

                                var authority = userData['authorities'][0]['authority'];
                                results.authority = authority;

                                if (authority == 'ROLE_VAR') {
                                    results.isVar = true;
                                    results.notVar = false;
                                } else {
                                    results.isVar = false;
                                    results.notVar = true;
                                }

                                if ((authority == 'ROLE_ADMIN') || (authority == 'ROLE_VAR')) {
                                    results.channelAccess = true;
                                } else {
                                    results.channelAccess = false;
                                }
                            } else {
                                results.isVar = false;
                                results.notVar = true;
                                results.channelAccess = false;
                            }

                            endpoint = serviceConfig.service_path + '/security/permissions/elevated?userName=' + username;
                            serviceHelper.tryInvoke(
                                host, port, endpoint, 'GET', 
                                {
                                    'x-token' : token,
                                    'x-time' : time,
                                    'x-username' : username,
                                    'x-targetType' : 'S',
                                    'x-targetId' : 0

                                }, null, function (err, sudoResponse) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(sudoResponse);
                                        results.isSudo = sudoResponse;
                                    }
                                    callback(null, results);
                                    return;
                                }
                            );
                        }
                    }
                );
            }
    });
}

module.exports = TableSafeUserProvider;