/**
 * Validate helper for mongoose schema validator
 * @author heroic
 */

var Validator = require('validator').Validator,
  validator = new Validator();

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