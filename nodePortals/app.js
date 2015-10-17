
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
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');

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
app.use(session({
    secret: 'tablesafe rail secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//app.use(cookieParser());

app.use(function (req, res, next) {
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;
    //delete req.session.error;
    //delete req.session.success;
    //delete req.session.notice;
    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;
    next();
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        var user = {};
        user.id = '1234';
        //User.findOne({ username: username }, function (err, user) {
        //    if (err) { return done(err); }
        //    if (!user) {
        //        return done(null, false, { message: 'Incorrect username.' });
        //    }
        //    if (!user.validPassword(password)) {
        //        return done(null, false, { message: 'Incorrect password.' });
        //    }
        //    // the user is valid
        //    return done(null, user);
        //});
        return done(null, user);
    }
));

app.post('/account/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

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
