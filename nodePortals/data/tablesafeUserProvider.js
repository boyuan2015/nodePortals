var serviceConfig = require('./config');
var ServiceHelper = require('./serviceHelper');
var moment = require('moment');
var serviceHelper = new ServiceHelper();

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
                }

                results.status = 'success';
                results.id = res['id'];
                results.username = username;
                results.token = token;
                results.password_expiration = res['pwdExpiration'];

        }
    });
}

module.exports = TableSafeUserProvider;