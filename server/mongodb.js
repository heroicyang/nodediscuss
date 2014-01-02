/**
 * Module dependencies
 */
var url = require('url');
var mongoose = require('mongoose'),
  nconf = require('nconf');

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
  var mongoServers = nconf.get('mongo:servers'),
    uris = [];

  uris.push(url.format({
    protocol: 'mongodb',
    host: '//' + mongoServers.shift(),
    pathname: '/' + nconf.get('mongo:db')
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