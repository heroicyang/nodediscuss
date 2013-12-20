/**
 * 将电子邮件信息打印到终端
 * @author heroic
 */

/**
 * Module dependencies
 */
var util = require('util'),
  Strategy = require('../strategy');

module.exports = exports = LogStrategy;

/**
 * 构造函数
 */
function LogStrategy() {
  Strategy.call(this);
  this.name = 'log';
}

/**
 * 继承 `Strategy`
 */
util.inherits(LogStrategy, Strategy);

/**
 * 实现 `send` 方法
 * @param  {Object} mailOptions e-mail data
 */
LogStrategy.prototype.send = function(mailOptions, callback) {
  console.dir(mailOptions);
  callback && callback(null);
};