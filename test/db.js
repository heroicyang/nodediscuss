/**
 * 连接数据库
 * @author heroic
 */

/**
 * Module dependencies
 */
var url = require('url'),
  mongoose = require('mongoose'),
  nconf = require('nconf');
require('../config').configure();

if (mongoose.connection.readyState !== 1) {
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

  mongoose.connect(uris.join(','), function(err) {
    if (err) {
      console.error('mongodb connect error: ', err.message);
      process.exit(1);
    }
  });
}

module.exports = exports = mongoose;
exports.models = require('../models');