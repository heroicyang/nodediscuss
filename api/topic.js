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
 * 根据查询条件获取话题
 * @param  {Object}   conditions 查询条件
 * @param  {Object}   options  查询选项
 * @param  {Function} callback 回调函数
 *  - err     MongooseError
 *  - topics  话题数组
 */
exports.query = function(conditions, options, callback) {
  if (typeof conditions === 'function') {
    callback = conditions;
    conditions = {};
    options = {};
  } else if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var pageIndex = options.pageIndex || 1,
    pageSize = options.pageSize || 20,
    fields = options.fields || null,
    sort = options.sort || {
      lastCommentedAt: -1,
      createdAt: -1
    },
    query;

  query = Topic.find(conditions)
    .sort(sort);

  if (fields) {
    query = query.select(fields);
  }

  query = query.skip((pageIndex - 1) * pageSize).limit(pageSize);

  query.exec(callback);
};

/**
 * 获取精华话题
 * @param  {Object}   options  查询选项
 * @param  {Function} callback  回调函数
 *  - err    MongooseError
 *  - topics 话题数组
 */
exports.queryByExcellent = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  exports.query({
    excellent: true
  }, options, callback);
};

/**
 * 获取最新创建的话题
 * @param  {Object}   options  查询选项
 * @param  {Function} callback  回调函数
 *  - err     MongooseError
 *  - topics  话题数组
 */
exports.queryLatest = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options.sort = {
    createdAt: -1
  };
  
  exports.query({}, options, callback);
};

/**
 * 获取没有评论的话题，并按创建时间倒序排序
 * @param  {Object}   options  查询选项
 * @param  {Function} callback    回调函数
 *  - err     MongooseError
 *  - topics   话题数组
 */
exports.queryNoComments = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options.sort = {
    createdAt: -1
  };

  exports.query({
    commentCount: {
      $lte: 0
    }
  }, options, callback);
};

/**
 * 根据节点名获取该节点下的话题
 * @param  {String}   tagName  节点名
 * @param  {Object}   options  查询选项
 * @param  {Function} callback 回调函数
 *  - err     MongooseError
 *  - topics   话题数组
 */
exports.queryByTag = function(tagName, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  exports.query({
    'tag.name': tagName
  }, options, callback);
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
 * 增加话题的浏览数
 * @param  {String}   id       话题 id
 * @param  {Function} callback 回调函数
 *  - err     MongooseError|Error
 *  - latestTopic   最新的 topic 对象
 */
exports.increaseViewsCount = function(id, callback) {
  Topic.findByIdAndUpdate(id, {
    $inc: {
      viewsCount: 1
    }
  }, function(err, latestTopic) {
    callback(err, latestTopic);
  });
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