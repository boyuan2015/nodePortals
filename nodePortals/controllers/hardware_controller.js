var express = require('express');
var router = express.Router();

function isEmpty(value) {
    return (value == null || value.length === 0);
}

router.route('/')
    .get(function (req, res, next) {
    res.render('./hardware/baseStation');
});

module.exports = router;