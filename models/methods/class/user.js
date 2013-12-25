/**
 * User 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async');
var mailers = require('../../../mailers');

/**
 * 获取用户数据
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count  记录总数
 *  - users  用户数据
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, callback);
};

/**
 * 增加新用户，并向新用户发送帐号激活邮件
 * @param {Object}   userData   用户数据
 * @param {Function} callback
 *  - err
 *  - user
 */
exports.add = function(userData, callback) {
  this.create(userData, function(err, user) {
    if (err) { return callback(err); }

    mailers.sendActivationMail(user, function(err) {
      callback(err, user);
    });
  });
};

/**
 * 修改用户信息
 * @param  {Object}   userData   用户数据
 *  - id     required   用户 id
 * @param  {Function} callback
 *  - err
 *  - user
 */
exports.edit = function(userData, callback) {
  var id = userData.id || userData._id;
  userData = _.omit(userData, ['_id, id']);

  this.findById(id, function(err, user) {
    if (err) {
      return callback(err);
    }

    if (!user || _.isEmpty(userData)) {
      return callback(null, user);
    }

    _.extend(user, userData);
    user.save(function(err, user) {
      callback(err, user);
    });
  });
};

/**
 * 根据条件查询单一用户
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - user
 */
exports.get = function(conditions, callback) {
  this.findOne(conditions, callback);
};

/**
 * 根据条件统计用户数量
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.getCount = function(conditions, callback) {
  this.count(conditions, callback);
};

/**
 * 根据条件检查用户是否存在
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - exist
 */
exports.isUserExist = function(conditions, callback) {
  this.get(conditions, function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, !!user);
  });
};

/**
 * 检查用户密码是否正确
 * @param  {Object}   userData
 *  - email      required    电子邮箱
 *  - password   required    密码
 * @param  {Function} callback
 *  - err
 *  - result      用户不存在则返回 null
 *    - user      用户对象
 *    - passed    密码正确则返回 true
 */
exports.check = function(userData, callback) {
  var email = userData.email,
    password = userData.password;
  this.get({
    email: email
  }, function(err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(null, null);
    }
    callback(null, {
      user: user,
      passed: user.authenticate(password)
    });
  });
};

/**
 * 改变用户状态
 * @param  {Object}   options
 *  - id     required    用户 id
 *  - state  required    变更的状态。状态值参见`constants.USER_STATE`
 * @param  {Function} callback
 *  - err
 *  - user
 */
exports.changeState = function(options, callback) {
  options = options || {};
  var id = options.id || options._id,
    state = options.state;
  this.findByIdAndUpdate(id, {
    state: state
  }, function(err, user) {
    callback(err, user);
  });
};

/**
 * 设置用户的认证状态
 * @param {Object}   options
 *  - id         required    用户 id
 *  - verified   required    认证状态。true 代表设置为认证用户，false 则代表非认证
 * @param {Function} callback
 *  - err
 *  - user
 */
exports.setVerified = function(options, callback) {
  options = options || {};
  var id = options.id || options._id,
    verified = _.isUndefined(options.verified) ? false : options.verified;
  this.findByIdAndUpdate(id, {
    verified: verified
  }, function(err, user) {
    callback(err, user);
  });
};

/**
 * 收藏某个话题
 * @param  {Object}   options
 *  - id        required    话题 id
 *  - userId    required    用户 id
 * @param  {Function} callback
 *  - err
 *  - result
 *    - user    执行该操作的用户
 *    - topic   所对应的话题数据
 */
exports.favoriteTopic = function(options, callback) {
  options = options || {};
  var id = options.id || options._id,
    userId = options.userId;
  var Topic = this.base.models.Topic,
    self = this;

  async.waterfall([
    function addToFavoriteUsers(next) {
      Topic.findByIdAndUpdate(id, {
        $addToSet: {
          favoriteUsers: userId
        },
        $inc: {
          favoriteCount: 1
        }
      }, function(err, topic) {
        next(err, topic);
      });
    },
    function updateUserFavoriteCount(topic, next) {
      if (!topic) {
        return next(null);
      }
      self.findByIdAndUpdate(userId, {
        $inc: {
          favoriteTopicCount: 1
        }
      }, function(err, user) {
        if (err) {
          return next(err);
        }
        next(null, {
          user: _.pick(user, ['_id', 'username', 'nickname']),
          topic: _.pick(topic, ['_id', 'title'])
        });
      });
    }
  ], callback);
};

/**
 * 取消收藏某个话题
 * @param  {Object}   options
 *  - id        required    话题 id
 *  - userId    required    用户 id
 * @param  {Function} callback
 *  - err
 *  - result
 *    - user    执行该操作的用户
 *    - topic   所对应的话题数据
 */
exports.unfavoriteTopic = function(options, callback) {
  options = options || {};
  var id = options.id || options._id,
    userId = options.userId;
  var Topic = this.base.models.Topic,
    self = this;

  async.waterfall([
    function addToFavoriteUsers(next) {
      Topic.findByIdAndUpdate(id, {
        $pull: {
          favoriteUsers: userId
        },
        $inc: {
          favoriteCount: -1
        }
      }, function(err, topic) {
        next(err, topic);
      });
    },
    function updateUserFavoriteCount(topic, next) {
      if (!topic) {
        return next(null);
      }
      self.findByIdAndUpdate(userId, {
        $inc: {
          favoriteTopicCount: -1
        }
      }, function(err, user) {
        if (err) {
          return next(err);
        }
        next(null, {
          user: _.pick(user, ['_id', 'username', 'nickname']),
          topic: _.pick(topic, ['_id', 'title'])
        });
      });
    }
  ], callback);
};

/**
 * 收藏某个节点
 * @param  {Object}   options
 *  - slug      required    节点地址
 *  - userId    required    用户 id
 * @param  {Function} callback
 *  - err
 *  - result
 *    - user  执行该操作的用户
 *    - tag   所对应的节点数据
 */
exports.favoriteTag = function(options, callback) {
  options = options || {};
  var slug = options.slug,
    userId = options.userId;
  var Tag = this.base.models.Tag,
    self = this;

  async.waterfall([
    function addToFavoriteUsers(next) {
      Tag.findOneAndUpdate({
        slug: slug
      }, {
        $addToSet: {
          favoriteUsers: userId
        },
        $inc: {
          favoriteCount: 1
        }
      }, function(err, tag) {
        next(err, tag);
      });
    },
    function updateUserFavoriteCount(tag, next) {
      if (!tag) {
        return next(null);
      }
      self.findByIdAndUpdate(userId, {
        $inc: {
          favoriteTagCount: 1
        }
      }, function(err, user) {
        if (err) {
          return next(err);
        }
        next(null, {
          user: _.pick(user, ['_id', 'username', 'nickname']),
          tag: _.pick(tag, ['_id', 'name'])
        });
      });
    }
  ], callback);
};

/**
 * 取消收藏某个节点
 * @param  {Object}   options
 *  - slug      required    节点地址
 *  - userId    required    用户 id
 * @param  {Function} callback
 *  - err
 *  - result
 *    - user  执行该操作的用户
 *    - tag   所对应的节点数据
 */
exports.unfavoriteTag = function(options, callback) {
  options = options || {};
  var slug = options.slug,
    userId = options.userId;
  var Tag = this.base.models.Tag,
    self = this;

  async.waterfall([
    function addToFavoriteUsers(next) {
      Tag.findOneAndUpdate({
        slug: slug
      }, {
        $pull: {
          favoriteUsers: userId
        },
        $inc: {
          favoriteCount: -1
        }
      }, function(err, tag) {
        next(err, tag);
      });
    },
    function updateUserFavoriteCount(tag, next) {
      if (!tag) {
        return next(null);
      }
      self.findByIdAndUpdate(userId, {
        $inc: {
          favoriteTagCount: -1
        }
      }, function(err, user) {
        if (err) {
          return next(err);
        }
        next(null, {
          user: _.pick(user, ['_id', 'username', 'nickname']),
          tag: _.pick(tag, ['_id', 'name'])
        });
      });
    }
  ], callback);
};