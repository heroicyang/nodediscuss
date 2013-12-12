/**
 * 评论相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  marked = require('../utils/marked'),
  models = require('../models'),
  Comment = models.Comment;

/**
 * 获取话题的评论列表
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount    符合查询条件评论记录总数
 *    - comments        评论列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || {},
    pageIndex = options.pageIndex,
    pageSize = options.pageSize,
    sort = options.sort || { createdAt: -1 };

  var q = Comment.query(conditions);
  q.query = q.query.sort(sort);
  q.paginate(pageIndex, pageSize)
    .exec(function(err, count, comments) {
      callback(err, {
        totalCount: count,
        comments: comments
      });
    });
};

/**
 * 创建评论
 * @param  {Object}   commentData 
 * @param  {Function} callback    回调函数
 *  - err      MongooseError|ValidationError
 */
exports.create = function(commentData, callback) {
  async.waterfall([
    function processMarkdown(next) {
      marked(commentData.content, function(err, contentHtml) {
        next(err, contentHtml);
      });
    },
    function createComment(contentHtml, next) {
      commentData.contentHtml = contentHtml;
      Comment.create(commentData, function(err) {
        next(err);
      });
    }
  ], callback);
};

/**
 * 根据评论 id 获取评论信息
 * @param  {Object}   args
 *  - id    评论 id
 * @param  {Function} callback
 *  - err    MongooseError
 *  - comment   评论对象
 */
exports.get = function(args, callback) {
  Comment.findById(args.id, callback);
};

/**
 * 根据评论 id 删除评论
 * @param  {[type]}   args
 *  - id    评论 id
 * @param  {Function} callback
 *  - err    MongooseError
 */
exports.remove = function(args, callback) {
  if (this.comment) {
    this.comment.destroy(function(err) {
      callback(err);
    });
  } else {
    Comment.destroy(args.id, function(err) {
      callback(err);
    });
  }
};

/**
 * 统计评论数量
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.count = function(callback) {
  Comment.count({ deleted: false }, callback);
};