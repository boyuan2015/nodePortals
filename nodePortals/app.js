var express = require('express');
var bodyParser = require('body-parser');
var routes2 = require('./routes/routes');
var http = require('http');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var db = require('./data');

// --------------------------------------------------------
// Setup local strategy authentication
// --------------------------------------------------------

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `done` (which is a callback) 
// with a user object, which will be set at `req.user` in route handlers after 
// authentication.
passport.use(new LocalStrategy(
    function (username, password, done) {
        db.users.findByUsername(username, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false);
            }
            //if (!user.validPassword(password)) {
            if (user.password != password) { return cb(null, false); }
            //    return done(null, false, { message: 'Incorrect password.' });
            //}
            // the user is valid
            return done(null, user);
        });
    }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, callback) {
    callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
    db.users.findById(id, function (err, user) {
        if (err) { return callback(err); }
        callback(null, user);
    });
});

// --------------------------------------------------------
// Setup Express application
// --------------------------------------------------------

var app = express();

// Set port number
app.set('port', process.env.PORT || 3000);

// Set main view directory
app.set('views', path.join(__dirname, 'views'));

// Set view engine
app.set('view engine', 'jade');

// --- Specify middlewares ---

//app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     // to support URL-encoded bodies
    extended: true
}));

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'tablesafe rail secret',
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
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

// --- Define routes

// Specify where to redirect when authentication success or fail 
app.post('/account/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true
}));

// development only
//if ('development' == app.get('env')) {
//    app.use(express.errorHandler());
//}

//app.get('/', routes.index);
//app.get('/users', user.list);

// Specify the main route entry
app.use('/', routes2);

// Start the server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
