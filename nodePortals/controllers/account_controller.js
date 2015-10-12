var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res, next) {
    res.render('./account/login');
});

router.route('/login')
    .post(function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if ((username == null) && (password == null)) {
        return res.render('./account/login');
    }
    
    if ((username == null) || (password == null)) {
        return res.render('./account/login', {status: 'Please specify a username and password.'})
    }
    console.log('Username: ' + req.body.username);
});

module.exports = router;