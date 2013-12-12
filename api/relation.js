/**
 * 用户关系链相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  Relation = models.Relation;

/**
 * 关注某个用户
 * @param  {Object}   args
 *  - userId    当前用户 id
 *  - followId  要关注的用户 id
 * @param  {Function} callback
 *  - err    MongooseError
 */
exports.create = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    followId = (this.user && this.user.id) || args.followId;
  Relation.create({
    userId: userId,
    followId: followId
  }, function(err) {
    callback(err);
  });
};

/**
 * 取消关注某个用户
 * @param  {Object}   args
 *  - userId    当前用户 id
 *  - followId  要取消关注的用户 id
 * @param  {Function} callback
 *  - err    MongooseError
 */
exports.remove = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    followId = (this.user && this.user.id) || args.followId;
  Relation.destroy(userId, followId, callback);
};

/**
 * 获取关系链列表
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount    符合条件关系总数
 *    - relations     关系列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};

  Relation.paginate(conditions, options, function(err, count, relations) {
    if (err) {
      return callback(err);
    }

    // `notPaged === true` 的情况
    if (typeof relations === 'undefined') {
      return callback(null, { relations: count });
    }

    callback(null, {
      totalCount: count,
      relations: relations
    });
  });
};