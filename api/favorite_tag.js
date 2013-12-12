/**
 * 用户节点收藏相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  models = require('../models'),
  Topic = models.Topic,
  FavoriteTag = models.FavoriteTag;

/**
 * 获取用户收藏的所有节点，以及节点下的话题列表（可选）
 * @param  {Object}   options
 *  - userId         required   需要获取其节点收藏的用户 id
 *  - includeTopics  optional   是否一并返回所收藏的节点下面的话题，默认 true
 *  如果需要一并返回收藏节点下面的话题列表，则可选以下四个选项
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - result
 *     - tags         收藏的节点列表
 *     - totalCount   所收藏节点下的话题总数。只在 includeTopics 为 true 时传入，否则是 undefined
 *     - topics       所收藏节点下的话题列表。只在 includeTopics 为 true 时传入，否则是 undefined
 */
exports.query = function(options, callback) {
  options = options || {};
  var userId = options.userId,
    includeTopics = typeof options.includeTopics !== 'undefined' ?
        options.includeTopics : true;

  async.waterfall([
    function getAllFavoriteTags(next) {
      FavoriteTag.find({
        userId: userId
      }, function(err, favoriteTags) {
        next(err, _.pluck(favoriteTags, 'tag'));
      });
    },
    function populateTopicsOfTag(favoriteTags, next) {
      if (!includeTopics) {
        return next(null, {
          tags: favoriteTags
        });
      }

      Topic.paginate({
        'tag.id': { $in: _.pluck(favoriteTags, 'id') }
      }, options, function(err, count, topics) {
        if (err) {
          return callback(err);
        }

        // `notPaged === true` 的情况
        if (typeof topics === 'undefined') {
          return callback(null, {
            tags: favoriteTags,
            topics: count
          });
        }

        callback(null, {
          totalCount: count,
          tags: favoriteTags,
          topics: topics
        });
      });
    }
  ], callback);
};

/**
 * 收藏某个节点
 * @param  {Object}   args
 *  - userId    required  用户 id
 *  - tagId     required  节点 id
 *  - tagName   required  节点名
 * @param  {Function} callback
 *  - err
 */
exports.create = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    tagId = (this.tag && this.tag.id) || args.tagId,
    tagName = (this.tag && this.tag.name) || args.tagName;

  FavoriteTag.create({
    userId: userId,
    tag: {
      id: tagId,
      name: tagName
    }
  }, function(err) {
    return callback(err);
  });
};

/**
 * 取消收藏某个节点
 * @param  {Object}   args
 *  - userId    required  用户 id
 *  - tagId     required  节点 id
 * @param  {Function} callback
 *  - err
 */
exports.remove = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    tagId = (this.tag && this.tag.id) || args.tagId;

  FavoriteTag.destroy(userId, tagId, function(err) {
    callback(err);
  });
};