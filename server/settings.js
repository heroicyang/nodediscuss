/**
 * Express 相关配置
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path');
var express = require('express'),
  nconf = require('nconf'),
  MongoStore = require('connect-mongo')(express),
  mutilpart = require('connect-multiparty');
var mongodb = require('./mongodb'),
  passport = require('./middlewares/passport'),
  locals = require('./middlewares/locals'),
  flash = require('./middlewares/flash'),
  errorHandling = require('./middlewares/error_handling');

var cwd = process.cwd();

module.exports = exports = function(app) {
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use('/upload/image', mutilpart());

    app.use(express.cookieParser(nconf.get('session:secret')));
    app.use(express.session({
      secret: nconf.get('session:secret'),
      cookie: {
        maxAge: nconf.get('session:maxAge')
      },
      store: new MongoStore({
        url: mongodb.connectionString
      })
    }));

    // 引入 csrf 中间件
    app.use(function(req, res, next) {
      // 当上传图片时，跳过此中间件
      if (req.path === '/upload/image') {
        return next();
      }
      express.csrf().apply(this, arguments);
    });

    // 引入 passport 中间件
    app.use(passport.initialize({
      userProperty: 'currentUser'
    }));
    app.use(passport.session());

    if (!nconf.get('static:domain')) {
      app.use(express.static(path.join(cwd, nconf.get('static:cwd'))));
    }
    if (!nconf.get('media:domain')) {
      app.use(express.static(path.join(cwd, nconf.get('media:cwd'))));
    }

    app.use(flash());

    // 引入本地变量中间件
    app.use(locals());
  });

  app.configure('development', function() {
    app.enable('verbose errors');
    app.use(express.logger('dev'));
  });

  app.configure('production', function() {
    app.use(express.logger());
    if (nconf.get('proxy')) {
      app.enable('trust proxy');
    }
  });

  app.use(app.router);

  // 引入错误处理中间件
  app.use(errorHandling.error500());
  app.use(errorHandling.error404());
};
