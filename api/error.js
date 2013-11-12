/**
 * APIError constructor
 * @param {String} msg Error message
 * @author heroic
 */
function APIError(msg) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = msg;
  this.name = 'APIError';
}

/**
 * Inherites from Error
 */
APIError.prototype.__proto__ = Error.prototype;

/**
 * Module exports
 */
module.exports = exports = APIError;