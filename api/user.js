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
  config = require('../config'),
  md5 = require('../utils/md5'),
  mailer = require('../utils/mailer'),
  CentralizedError = require('../utils/error').CentralizedError,
  models = require('../models'),
  User = models.User;

/**
 * 创建新用户
 * @param  {Object}   userData  用户对象，必须包含以下两个属性
 *  - password    密码
 *  - repassword  确认密码
 * @param  {Function} callback  回调函数
 *  - err    MongooseError|ValidationError|CentralizedError
 *  - user   已保存的用户对象
 */
exports.create = function(userData, callback) {
  var password = userData.password,
    repassword = userData.repassword,
    avatarUrl = url.format(config.avatarProvider),
    avatarSize = config.avatarProvider.size,
    emailHashed;

  if (password !== repassword) {
    return callback(new CentralizedError('两次输入的密码不一致', 'repassword'));
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
exports.getById = function(id, callback) {
  return User.findById(id, callback);
};

/**
 * 根据用户名查询用户
 * @param  {String}   username       用户名
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 *  - user   用户对象
 */
exports.getByUsername = function(username, callback) {
  return User.findOneByUsername(username, callback);
};

/**
 * 根据电子邮件地址查询用户
 * @param  {String}   email    电子邮件
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 *  - user   用户对象
 */
exports.getByEmail = function(email, callback) {
  return User.findOneByEmail(email, callback);
};

/**
 * 检查用户是否可以登录
 * @param  {String}   email    注册时填写的电子邮件
 * @param  {String}   password 密码
 * @param  {Function} callback 回调函数
 *  - err    MongooseError|CentralizedError
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
      return callback(new CentralizedError('用户不存在' ,'username'));
    }

    if (!matched) {
      return callback(new CentralizedError('密码错误', 'password'));
    }

    if (!user.state.activated) {
      return callback(new CentralizedError('帐号未激活', 'activated'));
    }

    callback(null, user);
  });
};

/**
 * 激活用户
 * @param  {String}   token    激活链接中的令牌信息
 * @param  {String}   email    激活链接中的 email
 * @param  {Function} callback 回调函数
 *  - err     MongooseError|CentralizedError
 */
exports.activate = function(token, email, callback) {
  async.waterfall([
    function findUser(next) {
      User.findOneByEmail(email, function(err, user) {
        if (err) {
          return next(err);
        }
        if (!user || md5(user.salt + user.email) !== token) {
          return next(new CentralizedError('信息有误，帐号无法激活', 'activated'));
        }
        if (user.state.activated) {
          return next(new CentralizedError('帐号已经是激活状态', 'activated', 'warning'));
        }

        next(null, user);
      });
    },
    function activateUser(user, next) {
      user.activate(next);
    }
  ], callback);
};