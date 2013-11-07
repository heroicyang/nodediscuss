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
  config = require('../config');

module.exports = exports = function(app) {
  app.configure(function() {
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');

    app.use(express.json());
    app.use(express.urlencoded());

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
  });

  app.configure('development', function() {
    app.use(express.logger('dev'));
    app.use(express.static(path.join(process.cwd(), config.static.rootDir)));
  });

  app.configure('production', function() {
    app.use(express.logger());
  });

  app.use(app.router);
};