/**
 * Exports config
 * @author heroic
 */
module.exports = exports = readConfig();

/**
 * Reads the config according to the NODE_ENV
 * @return {Object} config
 */
function readConfig() {
  var env = process.env.NODE_ENV || 'development',
    defaultConf = require('./default'),
    config = {};

  try {
    config = require('./' + env);
  } catch(e) {
    throw new Error('invalid configuration environment "' + env + '"');
  }

  config.__proto__ = defaultConf;
  return config;
}