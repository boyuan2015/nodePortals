var express = require('express');
//var bodyParser = require('body-parser');

var router = express.Router();
//router.use(bodyParser);

router.route('/')
    .get(function (req, res, next) {
        res.render('./home/index', 
            {
            Auth: {
                check: req.isAuthenticated(),
                user: req.session.user
            }
        }
        );
    });

module.exports = router;