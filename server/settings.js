/**
 * Express 相关配置
 * @author heroic
 */

/**
 * Module dependencies
 */
var path = require('path'),
  express = require('express'),
  MongoStore = require('connect-mongo')(express),
  mutilpart = require('connect-multiparty'),
  mongodb = require('./mongodb'),
  config = require('../config'),
  passport = require('./middlewares/passport'),
  breadcrumb = require('./middlewares/breadcrumb'),
  locals = require('./middlewares/locals'),
  flash = require('./middlewares/flash'),
  errorHandling = require('./middlewares/error_handling'),
  cwd = process.cwd();

module.exports = exports = function(app) {
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use('/upload/image', mutilpart());

    app.use(express.cookieParser(config.session.secret));
    app.use(express.session({
      secret: config.session.secret,
      cookie: {
        maxAge: config.session.maxAge
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
    app.use(passport.initialize());
    app.use(passport.session());

    if (!config.static.host) {
      app.use(express.static(path.join(cwd, config.static.cwd)));
    }
    if (!config.media.host) {
      app.use(express.static(path.join(cwd, config.media.cwd)));
    }

    app.use(flash());

    // 初始化面包屑导航中间件
    app.use(breadcrumb.init({
      homeTitle: '主页'
    }));

    // 引入本地变量中间件
    app.use(locals());
  });

  app.configure('development', function() {
    app.use(express.logger('dev'));
  });

  app.configure('production', function() {
    app.use(express.logger());
  });

  app.use(app.router);

  // 引入错误处理中间件
  app.use(errorHandling.error500());
  app.use(errorHandling.error404());
};