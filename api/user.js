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
 * 获取某个用户
 * @param  {Object}   userData
 *  - id        用户 id
 *  - username  用户名
 *  - email     电子邮件地址
 * @param  {Function} callback
 *  - err   MongooseError
 *  - user  查询到的用户对象
 */
exports.get = function(userData, callback) {
  var id = userData.id,
    username = userData.username,
    email = userData.email,
    currentUserId = this.currentUser && this.currentUser.id;
  async.waterfall([
    function getUser(next) {
      if (id) {
        User.findById(id, function(err, user) {
          next(err, user);
        });
      } else if (username) {
        User.findOneByUsername(username, function(err, user) {
          next(err, user);
        });
      } else if (email) {
        User.findOneByEmail(email, function(err, user) {
          next(err, user);
        });
      }
    },
    function checkRelation(user, next) {
      if (!user || !currentUserId || user.id === currentUserId) {
        return next(null, user);
      }
      user.isFollowedBy(currentUserId, function(err, followed) {
        if (err) {
          return next(err);
        }
        user.isFollowed = followed;
        next(null, user);
      });
    }
  ], callback);
};

/**
 * 检查用户是否可以登录
 * @param  {Object}   userData
 *  - email     required  注册时填写的电子邮件
 *  - password  required  密码
 * @param  {Function} callback
 *  - err    MongooseError|CentralizedError
 *  - user   用户对象
 */
exports.check = function(userData, callback) {
  var email = userData.email,
    password = userData.password;

  User.findOneByEmail(email, function(err, user) {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(new CentralizedError('用户不存在' ,'username'));
    }

    if (!user.authenticate(password)) {
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
 * @param  {Object}   args
 *  - token    激活链接中的令牌信息
 *  - email    激活链接中的 email
 * @param  {Function} callback 回调函数
 *  - err     MongooseError|CentralizedError
 */
exports.activate = function(args, callback) {
  var email = args.email,
    token = args.token;
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