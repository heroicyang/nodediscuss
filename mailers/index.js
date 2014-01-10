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
var sender = require('./sender'),
  renderer = require('./renderer');

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
      sender.send(mailOptions, next);
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
      sender.send(mailOptions, next);
    }
  ], callback);
};