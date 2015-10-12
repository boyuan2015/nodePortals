
/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
//var routes = require('./routes');
//var user = require('./routes/user');
var routes2 = require('./routes/routes');
var http = require('http');
var path = require('path');
//var cookieParser = require('cookie-parser');
//var cookieSession = require('cookie-session');
//var nodeSession = require('node-session');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     // to support URL-encoded bodies
    extended: true
}));
//app.use(express.methodOverride());
//app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cookieParser());
//app.use(cookieSession({ secret: 'tsafe node portal' }));
//app.use(nodeSession());

//app.use(function (req, res, next) {
//    res.locals.session = req.session;
//    next();
//});

// development only
//if ('development' == app.get('env')) {
//    app.use(express.errorHandler());
//}

//app.get('/', routes.index);
//app.get('/users', user.list);

app.use('/', routes2);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
