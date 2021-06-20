const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const configurations = require('./common/configurations');

let winston = undefined;
let expressWinston = undefined;
let winstonTransports = undefined;

if (configurations.server.log.isEnabled) {
  winston = require('winston');
  expressWinston = require('express-winston');
}


const indexRouter = require('./routes/index');
const pdfRouter = require('./routes/pdf');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json({limit: configurations.server.requestLimit}));
app.use(express.urlencoded({ extended: false, limit: configurations.server.requestLimit }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (configurations.server.log.isEnabled) {
  winstonTransports = [ new winston.transports.Console(JSON.parse(configurations.server.log.transport.console || '{}')) ];
  if (configurations.server.log.transport.file) {
    winstonTransports.push(new winston.transports.File(JSON.parse(configurations.server.log.transport.file)))
  }
  if (configurations.server.log.transport.http) {
    winstonTransports.push(new winston.transports.Http(JSON.parse(configurations.server.log.transport.http)))
  }
  if (configurations.server.log.transport.stream) {
    winstonTransports.push(new winston.transports.Stream(JSON.parse(configurations.server.log.transport.stream)))
  }
  app.use(expressWinston.logger({
    transports: winstonTransports,
    format: winston.format.combine( winston.format.colorize(), winston.format.json() ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: configurations.server.log.msg // msg: "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    // expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    // colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
  }));
}

app.use('/', indexRouter);

// API V1
app.use('/api/v1/pdf', pdfRouter);

if (configurations.server.log.isEnabled) {
  // Error Logging
  app.use(expressWinston.errorLogger({
    transports: winstonTransports,
    format: winston.format.combine( winston.format.colorize(), winston.format.json() ),
    msg: configurations.server.log.msg
  }));
}

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
