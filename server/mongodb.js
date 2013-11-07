/**
 * Module dependencies
 */
var url = require('url'),
  mongoose = require('mongoose'),
  config = require('../config');

/**
 * Connect to MongoDB
 */
exports.connect = function() {
  mongoose.connect(exports.connectionString, function(err) {
    if (err) {
      console.error('mongodb connect error: ', err.message);
      process.exit(1);
    }
  });
};

/**
 * Expose connection string
 * @type {String}
 */
exports.connectionString = loadConnectionString();

/**
 * 构造 MongoDB 连接字符串
 * @return {String} connection_string
 */
function loadConnectionString() {
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
  return uris.join(',');
}