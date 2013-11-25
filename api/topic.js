/**
 * 暴露 Topic 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  marked = require('../utils/marked'),
  models = require('../models'),
  Topic = models.Topic,
  FavoriteTopic = models.FavoriteTopic;

/**
 * 根据查询条件获取话题
 * @param  {Object}   options  查询选项
 *  - conditions  {Object}   查询条件，默认查询全部
 *  - pageIndex   {Number}   当前页数，默认为第1页
 *  - pageSize    {Number}   每页记录条数，默认20条
 *  - fields      {Object|String}  需要返回的字段，默认全部
 *  - sort        {Object}   排序条件，默认按创建时间和最后评论时间逆序排序
 * @param  {Function} callback 回调函数
 *  - err     MongooseError
 *  - topics  话题数组
 */
exports.query = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var conditions = options.conditions,
    pageIndex = options.pageIndex || 1,
    pageSize = options.pageSize || 20,
    fields = options.fields || null,
    sort = options.sort || {
      createdAt: -1,
      lastCommentedAt: -1
    },
    query = Topic.query();

  query = query.find(conditions)
    .sort(sort);

  if (fields) {
    query = query.select(fields);
  }

  query = query.skip((pageIndex - 1) * pageSize).limit(pageSize);

  query.exec(callback);
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
 * @param  {Object}   args   
 *  - id      话题 id
 *  - isView  是否为查看该话题。如果是查看该话题则会将话题的 viewsCount 属性值 +1
 * @param  {Function} callback  回调函数
 *  - err     MongooseError
 *  - topic   话题对象
 */
exports.get = function(args, callback) {
  var id = args.id,
    isView = typeof args.isView !== 'undefined' ? args.isView : false;
  if (isView) {
    Topic.findByIdAndUpdate(id, {
      $inc: {
        viewsCount: 1
      }
    }, function(err, topic) {
      callback(err, topic);
    });
  } else {
    Topic.findById(id, callback);
  }
};

/**
 * 根据话题 id 查询该话题是否被某个用户收藏
 * @param  {Object}   args
 *  - id       话题 id
 *  - userId   用户 id
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 *  - favorited   true: 收藏, false: 未收藏
 */
exports.isFavoritedBy = function(args, callback) {
  var topicId = args.id,
    userId = args.userId;
  FavoriteTopic.findOne({
    topicId: topicId,
    userId: userId
  }, function(err, favoriteTopic) {
    if (err) {
      return callback(err);
    }
    callback(null, !!favoriteTopic);
  });
};

/**
 * 收藏话题
 * @param  {Object}   args
 *  - id       话题 id
 *  - userId   用户 id
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 */
exports.favorite = function(args, callback) {
  var topicId = args.id,
    userId = args.userId;
  FavoriteTopic.create({
    topicId: topicId,
    userId: userId
  }, function(err) {
    callback(err);
  });
};

/**
 * 取消话题收藏
 * @param  {Object}   args
 *  - id       话题 id
 *  - userId   用户 id
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 */
exports.removeFavorite = function(args, callback) {
  var topicId = args.id,
    userId = args.userId;
  FavoriteTopic.destroy(userId, topicId, function(err) {
    callback(err);
  });
};