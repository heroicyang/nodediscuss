/**
 * 连接数据库
 * @author heroic
 */

/**
 * Module dependencies
 */
var url = require('url'),
  mongoose = require('mongoose'),
  config = require('../config');

if (mongoose.connection.readyState !== 1) {
  var mongoServers = config.mongo.servers,
    uris = [];

  uris.push(url.format({
    protocol: 'mongodb',
    host: '//' + mongoServers.shift(),
    pathname: '/' + config.mongo.db
  }));

  if (mongoServers.length > 0) {
    mongoServers.forEach(function(server) {
      uris.push(url.format({
        protocol: 'mongodb',
        host: '//' + server
      }));
    });
  }

  mongoose.connect(uris.join(','), function(err) {
    if (err) {
      console.error('mongodb connect error: ', err.message);
      process.exit(1);
    }
  });
}

module.exports = exports = mongoose;
exports.models = require('../models');