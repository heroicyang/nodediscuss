/**
 * 配置邮件发送策略，以及发送各种邮件的方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var util = require('util');
var async = require('async'),
  nconf = require('nconf');
var Mailer = require('../libs/mailer'),
  mailer = new Mailer(),
  NodeMailerStrategy = require('../plugins/nodemailer'),
  renderer = require('./renderer');

// 如果是生成环境，则禁用掉打印邮件内容的插件
if (process.env.NODE_ENV === 'production') {
  mailer.unuse('log');
}

// 加载 `NodeMailerStrategy` 插件
if (nconf.get('mailer:strategy') === 'nodemailer') {
  mailer.use(new NodeMailerStrategy(nconf.get('mailer:options')));
}

/**
 * 发送帐号激活邮件
 * @param  {Object}   user     用户对象
 * @param  {Function} callback
 *  - err
 */
exports.sendActivationMail = function(user, callback) {
  async.waterfall([
    function renderMailTmpl(next) {
      renderer.accountActivation(user, function(err, html) {
        next(err, html);
      });
    },
    function sendMail(html, next) {
      var mailOptions = {
        from: util.format('%s <%s>', nconf.get('mailer:senderName'), nconf.get('mailer:sender')),
        to: user.email,
        subject: nconf.get('site:name') + '帐号激活',
        html: html
      };
      mailer.send(nconf.get('mailer:strategy'), mailOptions, next);
    }
  ], callback);
};

/**
 * 发送密码重置邮件
 * @param  {Object}   resetPass  密码重置记录
 * @param  {Function} callback
 *  - err
 */
exports.sendResetPassMail = function(resetPass, callback) {
  async.waterfall([
    function renderMailTmpl(next) {
      renderer.resetPassword(resetPass, function(err, html) {
        next(err, html);
      });
    },
    function sendMail(html, next) {
      var mailOptions = {
        from: util.format('%s <%s>', nconf.get('mailer:senderName'), nconf.get('mailer:sender')),
        to: resetPass.email,
        subject: nconf.get('site:name') + '密码重置',
        html: html
      };
      mailer.send(nconf.get('mailer:strategy'), mailOptions, next);
    }
  ], callback);
};