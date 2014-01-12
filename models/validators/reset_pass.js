/**
 * Adds validators to ResetPassSchema
 * @author  heroic
 */

/**
 * Module dependencies
 */
var moment = require('moment');
var validator = require('../validator');

module.exports = exports = function(schema) {
  schema.path('email')
    .required(true, '电子邮件地址必填!')
    .validate(function(email) {
      return validator.isEmail(email);
    }, '不像是有效的电子邮件地址。')
    .validate(function(email, done) {
      var User = this.model('User'),
        self = this;
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(false);
        }
        if (!user) {
          return done(false);
        }

        self.userId = user.id;
        done(true);
      });
    }, '不存在使用该电子邮件地址注册的帐号。')
    .validate(function(email, done) {
      var ResetPass = this.model('ResetPass');
      // 找到一天之内的重置记录
      ResetPass.find({ email: email })
        .where('createdAt').lte(new Date()).gte(moment().add('hours', -24).toDate())
        .count(function(err, count) {
          if (err) {
            return done(false);
          }
          done(count < 2);
        });
    }, '你已经在 24 小时内重设了 2 次密码，请稍后再试。');
};