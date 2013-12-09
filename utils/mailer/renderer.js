/**
 * 邮件 HTML 内容渲染器
 * @author heroic
 */

/**
 * Module dependencies
 */
var url = require('url'),
  _ = require('lodash'),
  jade = require('jade'),
  md5 = require('../md5'),
  config = require('../../config');

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