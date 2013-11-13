/**
 * 电子邮件发射器
 * @author heroic
 */

/**
 * Module dependencies
 */
var Strategy = require('./Strategy'),
  LogStrategy = require('./strategies/log');

module.exports = exports = Mailer;
exports.Strategy = Strategy;

function Mailer() {
  this._strategies = {};

  // 默认使用 `LogStrategy`
  this.use(new LogStrategy());
}

/**
 * 使用给定的发送策略，如果提供了 `name` 参数，则会覆盖 `strategy` 的 `name` 属性
 *
 * Examples:
 *
 *    mailer.use(new LogStrategy());
 *    mailer.use('log', new LogStrategy());
 *    
 * @param  {String|Object} name     策略名称
 * @param  {Object} strategy        发送策略
 * @return {Mailer}
 */
Mailer.prototype.use = function(name, strategy) {
  if (!strategy) {
    strategy = name;
    name = strategy.name;
  }
  if (!name) {
    throw new Error('Mailer strategies must be have a name');
  }

  this._strategies[name] = strategy;
  return this;
};

/**
 * 从 Mailer 卸载发送策略
 *
 * Examples:
 *
 *    mailer.unuse('log');
 * 
 * @param  {String} name  策略名称
 * @return {Mailer}
 */
Mailer.prototype.unuse = function(name) {
  delete this._strategies[name];
  return this;
};

/**
 * 根据指定的策略名称使用对应的策略来发送电子邮件
 * @param  {String}   strategy    策略名称
 * @param  {Object}   mailOptions 电子邮件对象
 * @param  {Function} callback    回调函数
 *  - err     Error  发送失败
 */
Mailer.prototype.send = function(strategy, mailOptions, callback) {
  var name = strategy,
    logStrategy = this._strategies['log'];

  strategy = this._strategies[name];
  if (!strategy) {
    return callback(new Error('没有该邮件发送策略：' + name));
  }
  if (logStrategy && name !== 'log') {
    logStrategy.send(mailOptions);
  }

  strategy.send(mailOptions, callback);
};