/**
 * Tag 类方法
 * @author  heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 获取节点数据
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count  记录总数
 *  - tags   节点数据
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, callback);
};

/**
 * 增加新节点
 * @param {Object}   tagData    节点数据
 * @param {Function} callback
 *  - err
 *  - tag
 */
exports.add = function(tagData, callback) {
  this.create(tagData, callback);
};

/**
 * 修改节点信息
 * @param  {Object}   tagData   节点数据
 *  - id     required   节点 id
 * @param  {Function} callback
 *  - err
 *  - tag
 */
exports.edit = function(tagData, callback) {
  var id = tagData.id || tagData._id;
  tagData = _.omit(tagData, ['_id, id']);

  this.findById(id, function(err, tag) {
    if (err) {
      return callback(err);
    }

    if (!tag || _.isEmpty(tagData)) {
      return callback(null, tag);
    }

    _.extend(tag, tagData);
    tag.save(callback);
  });
};

/**
 * 根据条件查询单一节点
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - tag
 */
exports.get = function(conditions, callback) {
  this.findOne(conditions, callback);
};

/**
 * 根据条件统计节点数量
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.getCount = function(conditions, callback) {
  this.count(conditions, callback);
};

/**
 * 根据条件查询单个节点并删除该节点
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - tag
 */
exports.destroy = function(conditions, callback) {
  this.get(conditions, function(err, tag) {
    if (err) {
      return callback(err);
    }
    if (!tag) {
      return callback(null, tag);
    }
    tag.remove(callback);
  });
};

/**
 * 获取节点的收藏状态
 * @param  {Object}   options
 *  - userId    required    用户 id
 *  - tagId     required    节点 id
 * @param  {Function} callback
 *  - err
 *  - favorited
 */
exports.getFavoritedState = function(options, callback) {
  options = options || {};
  var userId = options.userId,
    tagId = options.tagId;
  this.findOne({
    _id: tagId,
    favoriteUsers: userId
  }, function(err, tag) {
    if (err) {
      return callback(err);
    }
    callback(null, !!tag);
  });
};