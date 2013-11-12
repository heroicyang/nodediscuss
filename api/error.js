/**
 * APIError constructor
 * @param {Object} errors 由各种类型组成的错误消息对象，必须满足以下条件
 *  - 对象的 key 代表类型
 *  - 对象的 value 是一个包含 `message` 属性的对象
 * 
 * Example:
 *   new APIError({
 *     password: {
 *       message: '密码错误'
 *     }
 *   });
 *   // or
 *   new APIError({
 *     username: {
 *       message: '用户名不能为空'
 *     },
 *     password: {
 *       message: '密码不能为空'
 *     }
 *   });
 *
 * @author heroic
 */
function APIError(errors) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = 'API throw an error';
  this.name = 'APIError';
  this.errors = errors || {};
}

/**
 * Inherites from Error
 */
APIError.prototype.__proto__ = Error.prototype;

/**
 * Module exports
 */
module.exports = exports = APIError;