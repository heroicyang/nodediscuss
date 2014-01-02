/**
 * config/index.js
 * 配置 `nconf`
 * @author heroic
 */

/**
 * Module dependencies
 */
var nconf = require('nconf');

exports.configure = function() {
  nconf.argv().env();
  var env = nconf.get('NODE_ENV') || 'development';
  nconf.file(env, 'config/' + env + '.json');
  nconf.file('default', 'config/default.json');
};