/**
 * 用 `NodeMailer` 库来发送电子邮件
 * 使用该策略之前请先安装 `NodeMailer` 库：
 *    `npm install nodemailer --save`
 * 
 * @author heroic
 */

/**
 * Module dependencies
 */
var util = require('util'),
  Strategy = require('../mailer').Strategy,
  nodemailer = require('nodemailer');

/**
 * NodeMailerStrategy constructor
 * @param {Object} options NodeMailer 创建 transport 时需要的选项
 */
function NodeMailerStrategy(options) {
  Strategy.call(this);
  this.name = 'nodemailer';
  this.transport = nodemailer.createTransport("SMTP", options);
}

/**
 * 从 `Strategy` 继承
 */
util.inherits(NodeMailerStrategy, Strategy);

/**
 * 实现 send 方法
 * @param  {Object} mailOptions e-mail data
 * @param  {Function} callback 回调函数
 */
NodeMailerStrategy.prototype.send = function(mailOptions, callback) {
  this.transport.sendMail(mailOptions, function(err) {
    callback(err);
  });
};

/**
 * Module exports
 */
module.exports = exports = NodeMailerStrategy;