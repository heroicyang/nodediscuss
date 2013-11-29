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
  var userId = options.userId,
    pageIndex = options.pageIndex,
    pageSize = options.pageSize,
    sort = options.sort || { createdAt: -1 };

  var q = FavoriteTopic.query({
    userId: userId
  });
  q.query = q.query.sort(sort);
  q.paginate(pageIndex, pageSize);
  
  async.waterfall([
    function execQuery(next) {
      q.exec(function(err, count, favoriteTopics) {
        next(err, count, favoriteTopics);
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
  ], function(err, results) {
    callback(err, results);
  });
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