/**
 * 自定义需要使用的错误对象
 * @author heroic
 */

/**
 * 统一标准的错误处理类
 * 主要也是为了兼容 Mongoose 抛出的 ValidationError，因为...
 * ...这些错误都是需要在客户端进行友好展示的。
 *
 * Examples:
 *
 *     new CentralizedError('密码错误', 'password')
 *     new CentralizedError('帐号已经处于激活状态', 'activated', 'warning');
 *     new CentralizedError({
 *       username: '用户名不能为空',
 *       password: '密码不能为空'
 *     });
 * 
 * @param {String|Object} msg   错误消息
 *  - 如果是 Object ，则必须以 `entry: msg` 格式组成的对象
 * @param {String} entry 错误条目，可以用于前端辨识哪个表单项出错之类，默认值是 'unknown'
 * @param {String} level 错误等级，此处采用 `Bootstrap` 中 `alert` 组件的类名称
 *  - level: 'success'|'info'|'warning'|'danger'    默认是 'danger'
 *
 * 该错误实例对象包含 `errors`, `message`, `name`, `level` 四个属性
 * 其中 `errors` 属性是由 `entry: msg` 格式组成的对象
 */
var CentralizedError = exports.CentralizedError = function(msg, entry, level) {
  var messages = [],
    message;

  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'CentralizedError';
  this.errors = {};

  if (typeof msg === 'object') {
    level = entry || 'danger';
    for (entry in msg) {
      if (msg.hasOwnProperty(entry)) {
        message = msg[entry];
        this.errors[entry] = {
          message: message
        };
        
        messages.push('There is `' + level + '` message on `' + entry + '`: ' + message);
      }
    }
  } else {
    entry = entry || 'unknown';
    level = level || 'danger';
    this.errors[entry] = {
      message: msg
    };
    messages.push('There is `' + level + '` message on `' + entry + '` : ' + msg);
  }

  this.level = level;
  this.message = messages.join('; ');
};

/**
 * Inherites from Error
 */
CentralizedError.prototype.__proto__ = Error.prototype;

/**
 * Expose other errors
 */
exports.UnauthorizedError = require('./errors/unauthorized');