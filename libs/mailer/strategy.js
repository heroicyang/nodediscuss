/**
 * 邮件发送策略接口，其它各种发送策略需继承并实现
 * @author heroic
 */

/**
 * 构造函数
 */
function Strategy() {
}

/**
 * 发送邮件
 * @param  {Object} mailOptions e-mail data
 */
Strategy.prototype.send = function(mailOptions, callback) {
  throw new Error('Strategy#send must be overridden by subclass');
};

/**
 * Module exports
 */
module.exports = exports = Strategy;