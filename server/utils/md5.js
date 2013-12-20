/**
 * MD5加密
 * @author heroic
 */

/**
 * Module dependencies
 */
var crypto = require('crypto');

/**
 * Module exports
 * @param  {String} str 需要进行加密的字符串
 * @return {String}     加密之后的字符串
 */
module.exports = exports = function(str) {
  var md5 = crypto.createHash('md5');
  md5.update(str);
  return md5.digest('hex');
};