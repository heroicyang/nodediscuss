/**
 * 暴露 Topic 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  marked = require('../utils/marked'),
  models = require('../models'),
  Topic = models.Topic,
  FavoriteTopic = models.FavoriteTopic;

/**
 * 处理话题内容中的 @
 * @param  {String} content 话题内容
 * @return {String}   将 @ 替换成 markdown 链接标记之后的内容
 */
function processAt(content) {
  return content.replace(/@([a-zA-Z0-9\-_]+)\s?/g, function(group, p1) {
    return _.template('[@<%= username %>](/user/<%= username %>) ', {
      username: p1
    });
  });
}

exports.query = function(conditions, callback) {
  var q = Topic.query(conditions);
  if (!callback) {
    return q;
  } else {
    q.execQuery(callback);
  }
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
      var content = topicData.content;
      content = processAt(content);
      marked(content, function(err, htmlContent) {
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
 * 编辑话题
 * @param  {Object}   topicData 话题对象
 * @param  {Function} callback  回调函数
 *  - err     MongooseError|Error
 */
exports.edit = function(topicData, callback) {
  async.waterfall([
    function processMarkdown(next) {
      var content = topicData.content;
      content = processAt(content);
      marked(content, function(err, htmlContent) {
        next(err, htmlContent);
      });
    },
    function updateTopic(htmlContent, next) {
      topicData.htmlContent = htmlContent;
      Topic.edit(topicData, function(err) {
        return next(err);
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