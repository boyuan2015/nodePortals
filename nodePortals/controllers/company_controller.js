var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res, next) {
    res.render('./company/index');
});

module.exports = router;