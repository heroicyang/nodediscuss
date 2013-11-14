/**
 * APIError constructor
 * @param {String|Object} msg  错误消息
 * @param {String} itemName  错误项，用于前端辨识哪个表单项出错之类
 * @param {String} level 错误等级
 *  - 'success'
 *  - 'info'
 *  - 'warning'
 *  - 'danger'
 * 
 * Example:
 *   new APIError('密码错误', 'password');
 *   // or
 *   new APIError({
 *     username: '用户名不能为空',
 *     password: '密码不能为空'
 *   });
 *
 * @author heroic
 */
function APIError(msg, itemName, level) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'APIError';
  this.errors = {};

  if (typeof msg === 'object') {
    for (var item in msg) {
      this.errors[item] = {
        message: msg[item]
      };
    }
    level = itemName;
  } else {
    itemName = itemName || 'unknown';
    this.errors[itemName] = {
      message: msg
    };
  }

  level = level || 'danger';
  this.level = level;
  this.message = '';

  for (var key in this.errors) {
    if (this.errors.hasOwnProperty(key)) {
      this.message += (key + ' has an ' +
            level + ' error message: ' + this.errors[key]);
      this.message += '; ';
    }
  }
}

/**
 * Inherites from Error
 */
APIError.prototype.__proto__ = Error.prototype;

/**
 * Module exports
 */
module.exports = exports = APIError;