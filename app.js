var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var bcrypt = require("bcrypt");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var username = "guest";
var password = "password";
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        password = hash;
        console.log("Hashed password = " + password);
    });
});


// Connecting to mongoDB
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://admin:pass@ds133378.mlab.com:33378/heroku_9vz0p4kh');
// var db = monk('localhost:27017/finalproject');

var index = require('./routes/index');
var mailer = require('./routes/mailer');
var contacts = require('./routes/contacts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({ secret: 'cmps369' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },

  function(user, pswd, done) {
    if ( user != username ) {
      console.log("Username mismatch");
      return done(null, false);
    }

    bcrypt.compare(pswd, password, function(err, isMatch) {
      if (err) return done(err);
      if ( !isMatch ) {
          console.log("Password mismatch");
      }
      else {
          console.log("Valid credentials");
      }
      done(null, isMatch);
    });
  }
));

passport.serializeUser(function(username, done) {
  done(null, username);
});

passport.deserializeUser(function(username, done) {
  done(null, username);
});

// Passing mongdb connection to routes
app.use(function(req,res,next){
    req.db = db;
    next();
});

index.post('/login',
    passport.authenticate('local', {
      successRedirect: '/contacts',
      failureRedirect: '/login_fail',
    })
);

index.get('/login', function (req, res) {
  res.render('login', {title: 'Please Login'});
});

index.get('/login_fail', function (req, res) {
  res.render('login', {title: 'Login Failed'});
});

index.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});


app.use('/', index);
app.use('/mailer', mailer);
app.use('/contacts', contacts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Sorry, resourse requested not found...');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
