var express = require('express');
var router = express.Router();

router.route('/')
    .get(function (req, res, next) {
    res.render('./admin/index', { title: 'Admin Panel' });
});

module.exports = router;