/**
 * Page 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash'),
  async = require('async');
var marked = require('../../../libs/marked');

/**
 * 获取页面数据
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count  记录总数
 *  - pages  页面数据
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, callback);
};

/**
 * 新建页面
 * @param {Object}   pageData    页面数据
 *  - creatorId    required    创建者用户 id
 * @param {Function} callback
 *  - err
 *  - page
 */
exports.add = function(pageData, callback) {
  var self = this,
    creatorId = pageData.creatorId;
  async.waterfall([
    function renderMarkdown(next) {
      marked(pageData.content, next);
    },
    function savePageData(contentHtml, next) {
      pageData.contributors = [creatorId];
      pageData.contentHtml = contentHtml;
      self.create(pageData, next);
    }
  ], callback);
};

/**
 * 修改页面信息
 * @param  {Object}   pageData   页面数据
 *  - id        required   页面 id
 *  - editorId  required   当前编辑者用户 id
 * @param  {Function} callback
 *  - err
 *  - page
 */
exports.edit = function(pageData, callback) {
  var id = pageData.id || pageData._id,
    editorId = pageData.editorId,
    self = this;
  pageData = _.omit(pageData, ['_id', 'id']);

  async.auto({
    contentHtml: function renderMarkdown(next) {
      marked(pageData.content, next);
    },
    page: function findPage(next) {
      self.findById(id, next);
    },
    updatedPage: ['contentHtml', 'page', function(next, results) {
      var page = results.page;
      if (!page) {
        return next(null, page);
      }

      pageData.contentHtml = results.contentHtml;
      _.extend(page, pageData);
      if (!_.contains(page.contributors, editorId)) {
        page.contributors.push(editorId);
      }
      page.save(callback);
    }]
  }, callback);
};

/**
 * 根据条件查询单一页面
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - page
 */
exports.get = function(conditions, callback) {
  this.findOne(conditions, callback);
};

/**
 * 根据条件统计页面数量
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.count = function(conditions, callback) {
  this.count(conditions, callback);
};


/**
 * 根据条件查询单一页面并删除该页面
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - page
 */
exports.destroy = function(conditions, callback) {
  this.get(conditions, function(err, page) {
    if (err) {
      return callback(err);
    }
    if (!page) {
      return callback(null, page);
    }
    page.remove(callback);
  });
};