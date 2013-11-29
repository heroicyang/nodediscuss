/**
 * 不被允许的操作
 * @author heroic
 */

/**
 * Module dependencies
 */
var CentralizedError = require('../error').CentralizedError;

function NotAllowedError(msg) {
  CentralizedError.call(this, msg, 'notAllowed');
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'NotAllowedError';
  this.status = 403;
}

/**
 * Inherites from CentralizedError
 */
 NotAllowedError.prototype.__proto__ = CentralizedError.prototype;

/**
 * Module exports
 */
module.exports = exports = NotAllowedError;