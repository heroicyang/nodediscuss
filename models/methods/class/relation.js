/**
 * Relation 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 获取已关注好友的 id
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count      记录总数
 *  - friendIds  已关注好友的 id 数组
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, function(err, count, relations) {
    if (err) {
      return callback(err);
    }

    if (_.isUndefined(relations)) {
      relations = count;
      count = count.length;
    }

    callback(null, count, _.pluck(relations, 'friendId'));
  });
};

/**
 * 添加关注
 * @param {Object}   data
 *  - userId    required   用户 id
 *  - targetId  required   要添加关注的用户 id
 * @param {Function} callback
 *  - err
 *  - result
 *     - friendId   添加为关注的用户 id
 *     - followed   当前关注状态
 */
exports.add = function(data, callback) {
  this.create({
    userId: data.userId,
    friendId: data.targetId
  }, function(err, relation) {
    if (err) {
      return callback(err);
    }
    callback(null, {
      friendId: data.targetId,
      followed: !!relation
    });
  });
};

/**
 * 取消关注
 * @param {Object}   data
 *  - userId    required   用户 id
 *  - targetId  required   要取消关注的用户 id
 * @param {Function} callback
 *  - err
 *  - result    为 null 时代表未关注过该用户
 *    - friendId     取消关注的好友 id
 *    - followed     当前关注状态
 */
exports.destroy = function(data, callback) {
  var userId = data.userId,
    targetId = data.targetId;
  this.findOne({
    userId: userId,
    friendId: targetId
  }, function(err, relation) {
    if (err) {
      return callback(err);
    }
    if (!relation) {
      return callback(null, null);
    }
    relation.remove(function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, {
        friendId: data.targetId,
        followed: false
      });
    });
  });
};

/**
 * 检查目标用户是否被关注
 * @param  {Object}   options
 *  - userId     required    需要检查的用户
 *  - targetId   required    目标用户
 * @param  {Function} callback
 *  - err
 *  - followed
 */
exports.check = function(options, callback) {
  options = options || {};
  var userId = options.userId,
    targetId = options.targetId;
  this.findOne({
    userId: userId,
    friendId: targetId
  }, function(err, relation) {
    if (err) {
      return callback(err);
    }
    callback(null, !!relation);
  });
};