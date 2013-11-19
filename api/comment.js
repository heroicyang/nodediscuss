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

exports.getById = function(id, callback) {
  Comment.findById(id, callback);
};