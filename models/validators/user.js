/**
 * Adds validators to UserSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var validate = require('../validate'),
  constants = require('../constants');

module.exports = exports = function(schema) {
  // 验证电子邮件地址是否有效
  schema.path('email')
    .required('true', '电子邮件地址必填!')
    .validate(function(email) {
      return !!validate(email).isEmail();
    }, '不像是有效的电子邮件地址。')
    .validate(function(email, done) {
      var self = this,
        User = this.model('User');
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(false);
        }
        if (user) {
          return done(user.id === self.id);
        }
        done(true);
      });
    }, '该邮件地址已被注册。');

  // 验证用户名是否有效
  schema.path('username')
    .required('true', '用户名不能为空!')
    .validate(function(username) {
      return username.length >= 6;
    }, '用户名至少为6位。')
    .validate(function(username) {
      return username.length <= 16;
    }, '用户名最多为16位。')
    .match(/^[a-zA-Z0-9\-_]+$/, '用户名无效! 仅支持字母、数字和下划线。')
    .validate(function(username, done) {
      var self = this,
        User = this.model('User');
      User.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(false);
        }
        if (user) {
          return done(user.id === self.id);
        }
        done(true);
      });
    }, '该用户名已被注册。');
  
  // 验证用户密码
  schema.path('passwordHashed')
    .validate(function() {
      if (this.isNew) {
        return !!this.password;
      }
      return true;
    }, '密码不能为空!')
    .validate(function() {
      if (!this.password) {
        return true;
      }
      return this.password.length >= 6;
    }, '密码至少为6位。')
    .validate(function() {
      if (!this.password) {
        return true;
      }
      return this.password.length <= 31;
    }, '密码最多为31位');
  
  // 如果有填写用户的个人主页，则验证是否是有效的网址
  schema.path('website')
    .validate(function(website) {
      if (website) {
        return !!validate(website).isUrl();
      }
      return true;
    }, '不像是有效的网站地址。');

  // 非用户输入性验证，所以没有自定义错误提示信息
  // 用户状态检查
  schema.path('state')
    .required(true)
    .enum(_.values(constants.USER_STATE));
};