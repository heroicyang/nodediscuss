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
  hostname: config.host,
  port: config.port
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