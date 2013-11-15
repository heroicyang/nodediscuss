/**
 * 暴露 Topic 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  marked = require('marked'),
  hljs = require('highlight.js'),
  models = require('../models'),
  Topic = models.Topic;

marked.setOptions({
  gfm: true,
  highlight: function(code, lang) {
    if (lang) {
      return hljs.highlight(lang, code).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  },
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});

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

/**
 * 发表新话题
 * @param  {Object}   topicData 话题对象
 * @param  {Function} callback  回调函数
 *  - err     MongooseError|Error
 */
exports.create = function(topicData, callback) {
  async.waterfall([
    function processMarkdown(next) {
      marked(topicData.content, function(err, htmlContent) {
        next(err, htmlContent);
      });
    },
    function createTopic(htmlContent, next) {
      topicData.htmlContent = htmlContent;
      Topic.create(topicData, function(err) {
        next(err);
      });
    }
  ], callback);
};

/**
 * 根据话题 id 获取话题
 * @param  {String}   id       话题 id
 * @param  {Function} callback  回调函数
 *  - err     MongooseError
 *  - topic   话题对象
 */
exports.getById = function(id, callback) {
  Topic.findById(id, callback);
};