/**
 * Validate helper for mongoose schema validator
 * @author heroic
 */

var validator = require('validator');

/**
 * 检查字符串是否是有效的 ObjectId 值
 */
validator.isObjectId = function(str) {
  if (!str.match(/^[0-9a-fA-F]{24}$/)) {
    return false;
  }
  return true;
};

/**
 * Exports validate method, using the facade pattern to wrap
 * @param  {String|Number|Date} val
 * @return {Validator}
 */
module.exports = exports = validator;