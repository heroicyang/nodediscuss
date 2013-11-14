/**
 * 暴露 Topic 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  Topic = models.Topic;

/**
 * 获取所有话题，按照最后评论时间降序排序
 * @param  {Function} callback 回调函数
 *  - err     MongooseError
 *  - topics  话题数组
 */
exports.getTopicsByLastCommentedAt = function(callback) {
  Topic.find()
    .sort({
      lastCommentedAt: -1
    })
    .exec(callback);
};

/**
 * 获取精华话题，按照发表时间降序排序
 * @param  {Function} callback  回调函数
 *  - err    MongooseError
 *  - topics 话题数组
 */
exports.getExcellentTopics = function(callback) {
  Topic.find({
    excellent: true
  })
    .sort({
      createdAt: -1
    })
    .exec(callback);
};

/**
 * 获取所有话题，按照发表时间降序排序
 * @param  {Function} callback  回调函数
 *  - err     MongooseError
 *  - topics  话题数组
 */
exports.getTopicsByCreatedAt = function(callback) {
  Topic.find()
    .sort({
      createdAt: -1
    })
    .exec(callback);
};

/**
 * 获取没有评论的话题，按照发表时间降序排序
 * @param  {Function} callback    回调函数
 *  - err     MongooseError
 *  - topics   话题数组
 */
exports.getNoCommentTopics = function(callback) {
  Topic.find()
    .where('commentCount').lte(0)
    .sort({
      createdAt: -1
    })
    .exec(callback);
};