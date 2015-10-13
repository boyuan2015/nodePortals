﻿var express = require('express');
//var params = require('express-params');     // allows validation of :id params with regex

var router = express.Router();
//params.extend(router);

console.log(__dirname);

var homeController = require('../controllers/home_controller');
var adminController = require('../controllers/admin_controller');
var accountController = require('../controllers/account_controller');
var companyController = require('../controllers/company_controller');
var hardwareController = require('../controllers/hardware_controller');
var posController = require('../controllers/pos_controller');
var reportController = require('../controllers/report_controller');
var systemController = require('../controllers/system_controller');


router.use('/', homeController);
router.use('/account', accountController);
router.use('/admin', adminController);
router.use('/company', companyController);
router.use('/hardware', hardwareController);
router.use('/pos', posController);
router.use('/report', reportController);
router.use('/system', systemController);

module.exports = router;