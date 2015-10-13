var express = require('express');
var router = express.Router();

function isEmpty(value) {
    return (value == null || value.length === 0);
}

router.route('/')
    .get(function (req, res, next) {
    res.render('./account/logout');
});

router.route('/login')
    .post(function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (isEmpty(username) && isEmpty(password)) {
        return res.render('./account/login');
    }
    
    if (isEmpty(username) || isEmpty(password)) {
        return res.render('./account/login', {
            res_message : 'Please specify a username and password.',
            res_alert_class : 'alert-danger'
        });
    }
    console.log('Username: ' + req.body.username);
});

module.exports = router;