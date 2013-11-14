/**
 * 权限错误
 * @author heroic
 */

/**
 * Module dependencies
 */
var CentralizedError = require('../error').CentralizedError;

function UnauthorizedError(msg) {
  CentralizedError.call(this, msg, 'unauthorized');
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'UnauthorizedError';
}

/**
 * Inherites from CentralizedError
 */
UnauthorizedError.prototype.__proto__ = CentralizedError.prototype;

/**
 * Module exports
 */
module.exports = exports = UnauthorizedError;