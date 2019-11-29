const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectBusboy = require('connect-busboy');

// Load middlewares
const firebaseLocals = require('./middlewares/firebase-locals');
const auth = require('./middlewares/auth');
const busboy = connectBusboy({
  immediate: true,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// Load routes
const index = require('./routes');
const login = require('./routes/login');
const files = require('./routes/files');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(firebaseLocals);
app.use(connectBusboy());

app.use('/', index);
app.use('/', login);
app.use('/files', auth, files);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
