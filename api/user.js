/**
 * 暴露 User 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var crypto = require('crypto'),
  url = require('url'),
  util = require('util'),
  APIError = require('./error'),
  config = require('../config'),
  mailer = require('../utils/mailer'),
  models = require('../models'),
  User = models.User;

/**
 * 创建新用户
 * @param  {Object}   userData  用户对象，必须包含以下两个属性
 *  - password    密码
 *  - repassword  确认密码
 * @param  {Function} callback  回调函数
 *  - err    MongooseError|ValidationError|APIError
 *  - user   已保存的用户对象
 */
exports.create = function(userData, callback) {
  var password = userData.password,
    repassword = userData.repassword,
    avatarUrl = url.format(config.avatarProvider),
    avatarSize = config.avatarProvider.size,
    md5,
    emailHashed;

  if (password !== repassword) {
    return callback(new APIError({
      repassword: {
        message: '两次输入的密码不一致'
      }
    }));
  }

  if (userData.email) {
    md5 = crypto.createHash('md5');
    md5.update(userData.email);
    emailHashed = md5.digest('hex');
    userData.avatar = util.format(avatarUrl, emailHashed, avatarSize);
  }

  return User.create(userData, function(err, user) {
    if (err) {
      return callback(err);
    }

    // 向注册用户发送验证邮件
    var mailOptions = {
      from: 'no-reply <no-reply@cnodejs.org>',
      to: user.email,
      subject: '激活邮件',
      html: '邮件内容...'
    };
    mailer.send('log', mailOptions, function(err) {
      callback(err, user);
    });
  });
};

/**
 * 根据用户 id 查询用户
 * @param  {String}   id       用户 id
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 *  - user   用户对象
 */
exports.findById = function(id, callback) {
  return User.findById(id, callback);
};

/**
 * 根据用户名查询用户
 * @param  {String}   username       用户名
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 *  - user   用户对象
 */
exports.findByUsername = function(username, callback) {
  return User.findByUsername(username, callback);
};

/**
 * 根据电子邮件地址查询用户
 * @param  {String}   email    电子邮件
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 *  - user   用户对象
 */
exports.findByEmail = function(email, callback) {
  return User.findByEmail(email, callback);
};

/**
 * 检查用户是否可以登录
 * @param  {String}   email    注册时填写的电子邮件
 * @param  {String}   password 密码
 * @param  {Function} callback 回调函数
 *  - err    MongooseError|APIError
 *  - user   用户对象
 */
exports.check = function(email, password, callback) {
  return User.check({
    email: email,
    password: password
  }, function(err, user, matched) {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(new APIError({
        username: {
          message: '用户不存在'
        }
      }));
    }

    if (!matched) {
      return callback(new APIError({
        password: {
          message: '密码错误'
        }
      }));
    }

    callback(null, user);
  });
};