/**
 * User 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var mailer = require('../../../mailer');

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

    mailer.sendActivationMail(user, function(err) {
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
    user.save(callback);
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
exports.count = function(conditions, callback) {
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
  var id = options.id,
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
  var id = options.id,
    verified = options.verified;
  this.findByIdAndUpdate(id, {
    verified: verified
  }, function(err, user) {
    callback(err, user);
  });
};