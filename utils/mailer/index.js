/**
 * 配置邮件发送策略，以及发送各种邮件
 * @author heroic
 */

/**
 * Module dependencies
 */
var util = require('util'),
  async = require('async'),
  Mailer = require('../../plugins/mailer'),
  mailer = new Mailer(),
  NodeMailerStrategy = require('../../plugins/nodemailer'),
  config = require('../../config'),
  renderer = require('./renderer');

// 如果是生成环境，则禁用掉打印邮件内容的插件
if (process.env.NODE_ENV === 'production') {
  mailer.unuse('log');
}

// 加载 `NodeMailerStrategy` 插件
mailer.use(new NodeMailerStrategy(config.mailer.options));

exports.sendActivationMail = function(user, callback) {
  async.waterfall([
    function renderMailTmpl(next) {
      renderer.accountActivation(user, function(err, html) {
        next(err, html);
      });
    },
    function sendMail(html, next) {
      var mailOptions = {
        from: util.format('%s <%s>', config.mailer.senderName, config.mailer.sender),
        to: user.email,
        subject: config.name + '帐号激活',
        html: html
      };
      mailer.send('log', mailOptions, next);
    }
  ], callback);
};