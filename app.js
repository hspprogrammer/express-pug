const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routers = require("./routes/index")
const fs = require('fs');

var app = express();

app.engine('html', function (filePath, options, callback) { // define the template engine
  console.log({filePath, options})
  fs.readFile(filePath, function (err, content) {
  if (err) return callback(new Error(err));
    // this is an extremely simple template engine
    var rendered = content.toString().replace('initData',JSON.stringify(options) )
    return callback(null, rendered);
  })
});

// 设置模版引擎
app.set('views', path.join(__dirname, './bin/views'));
app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, './vueViews'));
// app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './bin/public')));

// 监听路由
routers.forEach((router)=>{
  const filterMiddleware = (router.filters || []).map(filter=>{
    return require(path.join(__dirname, `./core/middleware/${filter}`))
  })
  app.all(router.address,filterMiddleware,async (req,res,next)=>{
    if (!(router.method || []).includes(req.method.toLowerCase()) && router.method !== 'all') {
      next();
      return;
    }
    try {
      const [controller, handler = 'index'] = router.controller.split('.');
      const CONTROLLER = require(path.join(__dirname, `./controller/${controller}`));
      await new CONTROLLER(req, res, next)[handler](req, res, next);
    } catch (e) {
      console.log(e)
      e.status = e.code == 'MODULE_NOT_FOUND' || e.message == '(intermediate value)[handler] is not a function' ? 404 : 500;
      req.error = e;
      next();
    }
  })
})

// ------------------错误处理--------------------
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(req.error?.status || 404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end(`error:${err.message}`);
});

module.exports = app;
