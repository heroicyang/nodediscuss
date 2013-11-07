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
  if (!config.session) {
    config.session = {};
  }
  config.session.secret = config.session.secret || createRandomString();
  return config;
}

/**
* Random string for secret key
* @return {String} random string
*/
function createRandomString() {
  var chars = '0123456789;[ABCDEFGHIJKLM]NOPQRSTUVWXTZ#&*abcdefghijklmnopqrstuvwxyz',
    strLength = 10,
    randomString = '';
  for (var i = 0; i < strLength; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum, rnum + 1);
  }
  return randomString;
}