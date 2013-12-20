/**
 * Comment 类方法
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
 * @param  {String} content  评论内容
 * @return {String} content
 */
var transformMention = function(content) {
  return content.replace(/@([a-zA-Z0-9\-_]+)\s?/g, function(group, p1) {
    return _.template('[@<%= username %>](/user/<%= username %>) ', {
      username: p1
    });
  });
};
/**
 * 转换内容中的 `#floor楼` 为链接形式
 * @param  {String} topicId  话题 id
 * @param  {String} content  评论内容
 * @return {String} content
 */
var transformFloor = function(topicId, content) {
  return content.replace(/#(\d+)楼\s?/g, function(group, p1) {
    return _.template('[#<%= floor %>楼](/topic/<%= topicId %>#comment-<%= floor %>) ', {
      floor: p1,
      topicId: topicId
    });
  });
};

/**
 * 获取评论数据
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count  记录总数
 *  - comments   评论数据
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, callback);
};

/**
 * 增加新评论
 * @param {Object}   commentData    评论数据
 * @param {Function} callback
 *  - err
 *  - comment
 */
exports.add = function(commentData, callback) {
  var self = this;
  async.waterfall([
    function renderMarkdown(next) {
      var content = transformMention(commentData.content);
      content = transformFloor(commentData.id, content);
      marked(content, next);
    },
    function saveCommentData(contentHtml, next) {
      commentData.contentHtml = contentHtml;
      self.create(commentData, next);
    }
  ], callback);
};

/**
 * 根据条件查询单条评论
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - comment
 */
exports.get = function(conditions, callback) {
  this.findOne(conditions, callback);
};

/**
 * 根据条件统计评论数量
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.getCount = function(conditions, callback) {
  this.count(conditions, callback);
};

/**
 * 根据条件查询单一评论并删除该评论。（非物理删除，只是做标记删除）
 * @param  {Object}   conditions    查询条件
 * @param  {Function} callback
 *  - err
 *  - comment
 */
exports.destroy = function(conditions, callback) {
  this.findOneAndUpdate(conditions, {
    deleted: true
  }, function(err, comment) {
    callback(err, comment);
  });
};