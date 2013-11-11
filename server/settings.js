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
  mongodb = require('./mongodb'),
  config = require('../config'),
  breadcrumb = require('./middlewares/breadcrumb'),
  locals = require('./middlewares/locals'),
  cwd = process.cwd();

module.exports = exports = function(app) {
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

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
    app.use(express.csrf());

    if (!config.static.host) {
      app.use(express.static(path.join(cwd, config.static.cwd)));
    }
    if (!config.media.host) {
      app.use(express.static(path.join(cwd, config.media.cwd)));
    }

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
};