var express = require('express');
//var params = require('express-params');     // allows validation of :id params with regex

var router = express.Router();
//params.extend(router);

console.log(__dirname);

var homeController = require('../controllers/home_controller');
var adminController = require('../controllers/admin_controller');
var companyController = require('../controllers/company_controller');
var systemController = require('../controllers/system_controller');


router.use('/', homeController);
router.use('/admin', adminController);
router.use('/company', companyController);
router.use('/system', systemController);

module.exports = router;