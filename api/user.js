/**
 * 暴露 User 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var url = require('url'),
  util = require('util'),
  async = require('async'),
  APIError = require('./error'),
  config = require('../config'),
  md5 = require('../utils/md5'),
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
    emailHashed;

  if (password !== repassword) {
    return callback(new APIError({
      repassword: {
        message: '两次输入的密码不一致'
      }
    }));
  }

  if (userData.email) {
    emailHashed = md5(userData.email);
    userData.avatar = util.format(avatarUrl, emailHashed, avatarSize);
  }

  return User.create(userData, function(err, user) {
    if (err) {
      return callback(err);
    }

    // 向注册用户发送验证邮件
    mailer.sendActivationMail(user, function(err) {
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

    if (!user.state.activated) {
      return callback(new APIError({
        activated: {
          message: '帐号未激活'
        }
      }));
    }

    callback(null, user);
  });
};

/**
 * 激活用户
 * @param  {String}   token    激活链接中的令牌信息
 * @param  {String}   email    激活链接中的 email
 * @param  {Function} callback 回调函数
 *  - err     MongooseError|APIError
 */
exports.activate = function(token, email, callback) {
  async.waterfall([
    function findUser(next) {
      User.findOneByEmail(email, function(err, user) {
        if (err) {
          return next(err);
        }
        if (!user || md5(user.salt + user.email) !== token) {
          return next(new APIError({
            activated: {
              message: '信息有误，帐号无法激活'
            }
          }));
        }
        if (user.state.activated) {
          return next(new APIError({
            activated: {
              message: '帐号已经是激活状态'
            }
          }, 'warning'));
        }

        next(null, user);
      });
    },
    function activateUser(user, next) {
      user.activate(next);
    }
  ], callback);
};