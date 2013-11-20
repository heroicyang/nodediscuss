/**
 * Adds validators to UserSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var validate = require('../validate');

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addEmailValidators(schema);
  addUsernameValidators(schema);
  addPasswordValidators(schema);
  addWebsiteValidators(schema);
};

/**
 * Adds validators on `email` path
 * @param {Mongoose.Schema} schema
 */
function addEmailValidators(schema) {
  schema.path('email')
    .required('true', '电子邮件地址必填!')
    .validate(function(email) {
      return !!validate(email).isEmail();
    }, '不像是有效的电子邮件地址。')
    .validate(function(email, done) {
      var self = this,
        User = this.model(this.constructor.modelName);
      User.findOneByEmail(email, function(err, user) {
        if (err) {
          return done(false);
        }
        if (user) {
          return done(user.id === self.id);
        }
        done(true);
      });
    }, '该邮件地址已被注册。');
}

/**
 * Adds validators on `username` path
 * @param {Mongoose.Schema} schema
 */
function addUsernameValidators(schema) {
  schema.path('username')
    .required('true', '用户名不能为空!')
    .validate(function(username) {
      return username.length >= 6;
    }, '用户名至少为6位。')
    .validate(function(username) {
      return username.length <= 16;
    }, '用户名最多为16位。')
    .match(/^[a-zA-Z0-9\-_]+$/, '用户名无效! 仅支持字母与数字。')
    .validate(function(username, done) {
      var self = this,
        User = this.model(this.constructor.modelName);
      User.findOneByUsername(username, function(err, user) {
        if (err) {
          return done(false);
        }
        if (user) {
          return done(user.id === self.id);
        }
        done(true);
      });
    }, '该用户名已被注册。');
}

/**
 * Adds validators on `passwordHashed` path
 * @param {Mongoose.Schema} schema
 */
function addPasswordValidators(schema) {
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
}

/**
 * Adds validators on `website` path
 * @param {Mongoose.Schema} schema
 */
function addWebsiteValidators(schema) {
  schema.path('website')
    .validate(function(website) {
      if (website) {
        return !!validate(website).isUrl();
      }
      return true;
    }, '不像是有效的网站地址。');
}