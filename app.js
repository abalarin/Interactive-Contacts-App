var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Connecting to mongoDB
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/finalproject');

var index = require('./routes/index');
var users = require('./routes/users');
var mailer = require('./routes/mailer');
var contacts = require('./routes/contacts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passing mongdb connection to routes
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/mailer', mailer);
app.use('/contacts', contacts);
app.use('/modal', index);

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
