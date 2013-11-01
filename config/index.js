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
    config = require('./' + env);

  config.__proto__ = defaultConf;
  if (!config.session) {
    config.session = {};
  }
  config.session.secret = createRandomString();
  return config;
}

/**
* Random string for secret key
* @return {String} random string
*/
function createRandomString() {
  return Math.round((new Date().valueOf() * Math.random())) + '';
}