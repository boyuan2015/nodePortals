var express = require('express');
//var bodyParser = require('body-parser');

var router = express.Router();
//router.use(bodyParser);

var isValidUser = false;

router.route('/')
    .all(function (req, res, next) {
        if (isValidUser) {
            next();
        } else {
            res.render('./account/login');
        }
    })
    .get(function (req, res, next) {
        res.render('./home/index', 
            {
            Auth: {
                check: req.isAuthenticated(),
                user: req.user
                //user: req.session.user
            }
        }
        );
    });

module.exports = router;