/**
 * Validate helper for mongoose schema validator
 * @author heroic
 */

var Validator = require('validator').Validator;

/**
 * 检查字符串是否是有效的 ObjectId 值
 */
Validator.prototype.isObjectId = function() {
  if (!this.str.match(/^[0-9a-fA-F]{24}$/)) {
    return this.error();
  }
  return this;
};

var validator = new Validator();

/**
 * Custom error handler
 * @return {Boolean}
 */
validator.error = function() {
  return false;
};

/**
 * Exports validate method, using the facade pattern to wrap
 * @param  {String|Number|Date} val
 * @return {Validator}
 */
module.exports = exports = function(val) {
  return validator.check(val);
};