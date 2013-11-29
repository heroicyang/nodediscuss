/**
 * 页面不存在
 * @author heroic
 */

/**
 * Module dependencies
 */
var CentralizedError = require('../error').CentralizedError;

function NotFoundError(msg) {
  CentralizedError.call(this, msg, 'notFound');
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'NotFoundError';
  this.status = 404;
}

/**
 * Inherites from CentralizedError
 */
 NotFoundError.prototype.__proto__ = CentralizedError.prototype;

/**
 * Module exports
 */
module.exports = exports = NotFoundError;