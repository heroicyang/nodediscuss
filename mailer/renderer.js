/**
 * 邮件的 HTML 内容渲染器
 * @author heroic
 */

/**
 * Module dependencies
 */
var crypto = require('crypto'),
  url = require('url');
var _ = require('lodash'),
  jade = require('jade');
var config = require('../config');

var urlObj = {
  protocol: 'http',
  host: config.host
},
site = {
  name: config.name,
  url: url.format(urlObj)
};

function getTemplate(filename) {
  return __dirname + '/templates/' + filename;
}

/**
 * 执行 md5 加密
 * @param  {String} str 需要进行加密的字符串
 * @return {String}     加密之后的字符串
 */
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * 帐号激活邮件模板渲染
 * @param  {Objecr}   user     用户对象
 * @param  {Function} callback
 *  - err
 *  - html
 */
exports.accountActivation = function(user, callback) {
  var activationUrl = url.format(_.extend({
    pathname: '/active',
    search: 'token=' + md5(user.salt + user.email) + '&email=' + user.email
  }, urlObj));

  jade.renderFile(getTemplate('activation.jade'), {
    user: user,
    site: site,
    activationUrl: activationUrl
  }, callback);
};

/**
 * 密码重置邮件模板渲染
 * @param  {Objecr}   resetPass     密码重置记录
 * @param  {Function} callback
 *  - err
 *  - html
 */
exports.resetPassword = function(resetPass, callback) {
  var resetPassUrl = url.format(_.extend({
    pathname: '/reset',
    search: 'token=' + md5(resetPass.id + resetPass.email) + '&email=' + resetPass.email
  }, urlObj));

  jade.renderFile(getTemplate('reset_pass.jade'), {
    site: site,
    resetPassUrl: resetPassUrl
  }, callback);
};