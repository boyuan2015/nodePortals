var serviceConfig = require('./config');
var ServiceHelper = require('./serviceHelper');
var serviceHelper = new ServiceHelper();

var user;
var passwordExpired;

function TableSafeUserProvider() {

}

TableSafeUserProvider.prototype.authenticateUser = function(username, password) {
    var results = [];
    var host = serviceConfig.base_url;
    var port = serviceConfig.port;
    var endpoint = serviceConfig.service_path + '/user/login';
    var data = {
        'userName' : username,
        'password' : password
    };

    serviceHelper.tryInvoke(host, port, endpoint, 'POST', data, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });
}

module.exports = TableSafeUserProvider;