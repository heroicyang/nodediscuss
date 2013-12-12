/**
 * 用户话题收藏相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  models = require('../models'),
  Topic = models.Topic,
  FavoriteTopic = models.FavoriteTopic;

/**
 * 获取用户收藏的话题
 * @param  {Object}   options
 *  - userId         required   需要获取其话题收藏的用户 id
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount    收藏的话题记录总数
 *    - topics        收藏的话题列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var userId = options.userId;
  
  async.waterfall([
    function execQuery(next) {
      FavoriteTopic.paginate({
        userId: userId
      }, options, function(err, count, favoriteTopics) {
        if (err) {
          return next(err);
        }

        // `notPaged === true` 的情况
        if (typeof favoriteTopics === 'undefined') {
          return next(null, favoriteTopics.length, favoriteTopics);
        }

        next(null, count, favoriteTopics);
      });
    },
    function populateTopics(count, favoriteTopics, next) {
      async.map(favoriteTopics, function(favoriteTopic, next) {
        Topic.findById(favoriteTopic.topicId, function(err, topic) {
          if (err) {
            return next(err);
          }
          if (!topic) {
            topic = { deleted: true };
          }
          next(null, topic);
        });
      }, function(err, topics) {
        next(err, {
          totalCount: count,
          topics: topics
        });
      });
    }
  ], callback);
};

/**
 * 收藏某个话题
 * @param  {Object}   args
 *  - userId    required  用户 id
 *  - topicId   required  话题 id
 * @param  {Function} callback
 *  - err
 */
exports.create = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    topicId = (this.topic && this.topic.id) || args.topicId;

  FavoriteTopic.create({
    userId: userId,
    topicId: topicId
  }, function(err) {
    return callback(err);
  });
};

/**
 * 取消收藏某个话题
 * @param  {Object}   args
 *  - userId    required  用户 id
 *  - topicId   required  话题 id
 * @param  {Function} callback
 *  - err
 */
exports.remove = function(args, callback) {
  var userId = (this.currentUser && this.currentUser.id) || args.userId,
    topicId = (this.topic && this.topic.id) || args.topicId;

  FavoriteTopic.destroy(userId, topicId, function(err) {
    callback(err);
  });
};