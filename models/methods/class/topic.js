/**
 * Topic 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async');
var marked = require('../../../libs/marked');

/**
 * 转换内容中的 `@username` 为链接形式
 * @param  {String} content
 */
var transformMention = function(content) {
  return content.replace(/@([a-zA-Z0-9\-_]+)\s?/g, function(group, p1) {
    return _.template('[@<%= username %>](/user/<%= username %>) ', {
      username: p1
    });
  });
};

/**
 * 获取话题数据
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count  记录总数
 *  - topics  话题数据
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, callback);
};

/**
 * 新建话题
 * @param {Object}   topicData    话题数据
 * @param {Function} callback
 *  - err
 *  - topic
 */
exports.add = function(topicData, callback) {
  var self = this;
  async.waterfall([
    function renderMarkdown(next) {
      var content = transformMention(topicData.content);
      marked(content, next);
    },
    function saveTopicData(contentHtml, next) {
      topicData.contentHtml = contentHtml;
      self.create(topicData, next);
    }
  ], callback);
};

/**
 * 修改话题信息
 * @param  {Object}   topicData   话题数据
 *  - id     required   话题 id
 * @param  {Function} callback
 *  - err
 *  - topic
 */
exports.edit = function(topicData, callback) {
  var id = topicData.id || topicData._id,
    self = this;
  topicData = _.omit(topicData, ['_id', 'id']);

  async.auto({
    contentHtml: function renderMarkdown(next) {
      if (!topicData.content) {
        return next(null, null);
      }
      var content = transformMention(topicData.content);
      marked(content, next);
    },
    topic: function findTopic(next) {
      self.findById(id, next);
    },
    updatedTopic: ['contentHtml', 'topic', function(next, results) {
      var topic = results.topic;
      if (!topic) {
        return next(null, topic);
      }
      topicData.contentHtml = results.contentHtml;
      _.extend(topic, topicData);
      topic.save(function(err, topic) {
        next(err, topic);
      });
    }]
  }, callback);
};

/**
 * 根据条件查询单一话题
 * @param  {Object}   conditions  查询条件
 * @param  {Function} callback
 *  - err
 *  - topic
 */
exports.get = function(conditions, callback) {
  this.findOne({
    $query: conditions,
    $orderby: { createdAt: -1 }
  }, callback);
};

/**
 * 根据条件统计话题数量
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.getCount = function(conditions, callback) {
  this.count(conditions, callback);
};


/**
 * 根据条件查询单一话题并删除该话题
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - topic
 */
exports.destroy = function(conditions, callback) {
  this.get(conditions, function(err, topic) {
    if (err) {
      return callback(err);
    }
    if (!topic) {
      return callback(null, topic);
    }
    topic.remove(callback);
  });
};

/**
 * 设置为优质或非优质话题
 * @param {Object}   options
 *  - id          required    话题 id
 *  - excellent   required    是否为优质话题
 * @param {Function} callback
 *  - err
 *  - topic
 */
exports.setExcellent = function(options, callback) {
  options = options || {};
  var id = options.id || options._id,
    excellent = _.isUndefined(options.excellent) ? false : options.excellent;
  this.findByIdAndUpdate(id, {
    excellent: excellent
  }, function(err, topic) {
    callback(err, topic);
  });
};

/**
 * 设置为置顶或取消置顶
 * @param {Object}   options
 *  - id      required    话题 id
 *  - topic   required    是否置顶
 * @param {Function} callback
 *  - err
 *  - topic
 */
exports.setTop = function(options, callback) {
  options = options || {};
  var id = options.id || options._id,
    top = _.isUndefined(options.top) ? false : options.top;
  this.findByIdAndUpdate(id, {
    top: top
  }, function(err, topic) {
    callback(err, topic);
  });
};

/**
 * 根据条件对某个话题的阅读数量进行 +1 操作
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - topic
 */
exports.incViews = function(conditions, callback) {
  this.findOneAndUpdate(conditions, {
    $inc: {
      views: 1
    }
  }, function(err, topic) {
    callback(err, topic);
  });
};

/**
 * 获取话题的收藏状态
 * @param  {Object}   options
 *  - userId      required    用户 id
 *  - topicId     required    话题 id
 * @param  {Function} callback
 *  - err
 *  - favorited
 */
exports.getFavoritedState = function(options, callback) {
  options = options || {};
  var userId = options.userId,
    topicId = options.topicId;
  this.findOne({
    _id: topicId,
    favoriteUsers: userId
  }, function(err, topic) {
    if (err) {
      return callback(err);
    }
    callback(null, !!topic);
  });
};