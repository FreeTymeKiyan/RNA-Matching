var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

// routes
var home = require('./routes/home');
var form = require('./routes/form');
var params = require('./routes/params');
var tutorial = require('./routes/tutorial');
var about = require('./routes/about');
var download = require('./routes/download');
var result = require('./routes/result');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ 
  dest: '../public/tmp/', 
  rename: function (fieldname, filename) {
    return fieldname + filename + Date.now();
  },
  limits: {
    files: 2
  },
  onFileUploadStart: function (file) {
    console.log(file.fieldname + ' is starting ...');
    if (file.originalname == 'virus.exe') return false;
  },
  onFileUploadData: function (file, data) {
    console.log(data.length + ' of ' + file.fieldname + ' arrived');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
    // TODO move to uploads seperately
  },
  onError: function (error, next) {
    console.log(error);
    next(error);
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/mmirna-tar', form);
app.use('/params', params);
app.use('/tutorial', tutorial);
app.use('/about', about);
app.use('/download', download);
app.use('/result', result);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
