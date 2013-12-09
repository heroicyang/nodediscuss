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
  moment = require('moment'),
  config = require('../config'),
  md5 = require('../utils/md5'),
  mailer = require('../utils/mailer'),
  CentralizedError = require('../utils/error').CentralizedError,
  models = require('../models'),
  User = models.User,
  ResetPass = models.ResetPass,
  Topic = models.Topic;

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

  User.create(userData, function(err, user) {
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
 * 更改用户基本资料
 * @param  {Object}   userData    用户对象
 *  - id             required    用户 id
 * @param  {Function} callback
 *  - err
 */
exports.edit = function(userData, callback) {
  User.edit(userData, callback);
};

/**
 * 更改用户密码
 * @param  {Object}   userData
 *  - id             required   用户  id
 *  - oldPassword    required   当前密码
 *  - newPassword    required   新密码
 * @param  {Function} callback
 *  - err
 */
exports.changePassword = function(userData, callback) {
  var userId = (this.currentUser && this.currentUser.id) ||
        userData.id || userData._id,
    oldPassword = userData.oldPassword,
    newPassword = userData.newPassword;

  async.waterfall([
    function getUser(next) {
      User.findById(userId, function(err, user) {
        next(err, user);
      });
    },
    function updatePassword(user, next) {
      if (!user) {
        return next(null, user);
      }
      if (!user.authenticate(oldPassword)) {
        return next(new CentralizedError('请输入正确的当前密码', 'password'));
      }
      user.changePassword(newPassword, function(err) {
        next(err);
      });
    }
  ], callback);
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

    if (user.state.blocked) {
      return callback(new CentralizedError('帐号被锁定，请联系管理员解锁', 'blocked'));
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

/**
 * 申请密码重置
 * @param  {Object}   userData
 *  - email     required    注册时的电子邮箱
 * @param  {Function} callback
 *  - err
 */
exports.forgotPassword = function(userData, callback) {
  var email = userData.email;
  async.waterfall([
    function createResetPass(next) {
      ResetPass.create({
        email: email
      }, function(err, resetPass) {
        next(err, resetPass);
      });
    },
    function sendMail(resetPass, next) {
      mailer.sendResetPassMail(resetPass, function(err) {
        next(err);
      });
    }
  ], callback);
};

/**
 * 获取最近一次申请的重置密码记录
 * @param  {Object}   args
 *  - email      required
 * @param  {Function} callback
 *  - err
 *  - resetPass     重置密码记录
 */
exports.getResetPassRecord = function(args, callback) {
  var email = args.email,
    token = args.token;

  ResetPass
    .findOne({
      email: email
    })
    .sort({
      createdAt: -1
    })
    .exec(function(err, resetPass) {
      if (err) {
        return callback(err);
      }

      if (!resetPass || md5(resetPass.id + resetPass.email) !== token) {
        return callback(new CentralizedError('信息有误，不能继续重设密码操作'));
      }

      if (!resetPass.available) {
        return callback(new CentralizedError('该密码重置链接已失效', 'available', 'warning'));
      }

      if (moment().add('hours', -24).toDate() > resetPass.createdAt) {
        return callback(new CentralizedError('该密码重置链接已过期，请重新提交重置密码申请', 'expire', 'warning'));
      }

      callback(err, resetPass);
    });
};

/**
 * 重置密码
 * @param  {Object}   args
 *  - userId         required   用户 id
 *  - newPassword    required   新密码
 *  - resetPassId    required   密码重置记录 id
 * @param  {Function} callback
 *  - err
 */
exports.resetPassword = function(args, callback) {
  var userId = args.userId,
    newPassword = args.newPassword,
    resetPassId = args.resetPassId;

  async.waterfall([
    function updatePassword(next) {
      User.changePassword({
        id: userId,
        newPassword: newPassword
      }, function(err) {
        next(err);
      });
    },
    function unavailableResetPass(next) {
      ResetPass.findByIdAndUpdate(resetPassId, {
        available: false
      }, function(err) {
        next(err);
      });
    }
  ], callback);
};

/**
 * 获取某个用户最近发布的一个话题
 * @param  {Object}   args
 *  - id      required   用户  id
 * @param  {Function} callback
 */
exports.getLatestTopic = function(args, callback) {
  var userId = args.id;
  Topic
    .findOne({
      'author.id': userId
    })
    .sort({ createdAt: -1 })
    .exec(callback);
};