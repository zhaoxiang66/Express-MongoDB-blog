var createError = require('http-errors');
var express = require('express');
var path = require('path');
var settings = require('./settings');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var routes = require('./routes/index');
console.log(routes);
var app = express();
//console.log(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:settings.cookieSecret,
  key:settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30days
  store: new MongoStore({
    url: settings.url,
    db: settings.db
  })
}))
app.use(flash());
routes(app);
app.use(express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

