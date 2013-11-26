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
 * 根据查询条件获取话题评论
 * @param  {Object}   options  查询选项
 *  - conditions  {Object}   查询条件，默认查询全部
 *  - pageIndex   {Number}   当前页数，默认为第1页
 *  - pageSize    {Number}   每页记录条数，默认20条
 *  - fields      {Object|String}  需要返回的字段，默认全部
 *  - sort        {Object}   排序条件，默认按创建时间逆序排序
 * @param  {Function} callback 回调函数
 *  - err     MongooseError
 *  - comments  评论数组
 */
exports.query = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var query = Comment.find().lean(),
    conditions = options.conditions || {},
    pageIndex = options.pageIndex || 1,
    pageSize = options.pageSize || 20,
    fields = options.fields || null,
    sort = options.sort || {
      createdAt: -1
    };

  query = query.find(conditions).sort(sort);

  if (fields) {
    query = query.select(fields);
  }

  query = query.skip((pageIndex - 1) * pageSize).limit(pageSize);

  query.exec(callback);
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
      marked(commentData.content, function(err, htmlContent) {
        next(err, htmlContent);
      });
    },
    function createComment(htmlContent, next) {
      commentData.htmlContent = htmlContent;
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
  Comment.destroy(args.id, callback);
};