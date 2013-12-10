/**
 * Page 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  marked = require('../utils/marked'),
  models = require('../models'),
  User = models.User,
  Page = models.Page;

/**
 * 获取页面列表
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount    符合查询条件页面记录总数
 *    - pages         页面列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || {},
    pageIndex = options.pageIndex,
    pageSize = options.pageSize,
    sort = options.sort || { createdAt: -1 };

  var q = Page.query(conditions);
  q.query = q.query.sort(sort);
  q.paginate(pageIndex, pageSize)
    .exec(function(err, count, pages) {
      callback(err, {
        totalCount: count,
        pages: pages
      });
    });
};

/**
 * 创建新页面
 * @param  {Object}   pageData
 *  - authorId   required   创建该页面的当前作者
 * @param  {Function} callback
 *  - err
 *  - page
 */
exports.create = function(pageData, callback) {
  var authorId = (this.currentUser && this.currentUser.id) || pageData.authorId;

  async.waterfall([
    function processMarkdown(next) {
      marked(pageData.content, function(err, contentHtml) {
        next(err, contentHtml);
      });
    },
    function createPage(contentHtml, next) {
      pageData.contentHtml = contentHtml;
      pageData.authorIds = pageData.authorIds || [];
      pageData.authorIds.push(authorId);
      Page.create(pageData, function(err, page) {
        next(err, page);
      });
    }
  ], callback);
};

/**
 * 编辑页面
 * @param  {Object}   pageData
 *  - id          required     页面 id
 *  - editorId    required     编辑人 id
 * @param  {Function} callback
 *  - err
 *  - page
 */
exports.edit = function(pageData, callback) {
  var editorId = (this.currentUser && this.currentUser.id) || pageData.editorId;

  async.waterfall([
    function processMarkdown(next) {
      marked(pageData.content, function(err, contentHtml) {
        next(err, contentHtml);
      });
    },
    function createPage(contentHtml, next) {
      pageData.contentHtml = contentHtml;
      pageData.editorId = editorId;
      Page.edit(pageData, function(err, page) {
        next(err, page);
      });
    }
  ], callback);
};

/**
 * 获取某个页面信息
 * @param  {Object}   args
 *  - slug     required    页面地址
 * @param  {Function} callback
 *  - err
 *  - page
 */
exports.get = function(args, callback) {
  var slug = args.slug;
  
  async.waterfall([
    function getPage(next) {
      Page.findOne({
        slug: slug
      }, function(err, page) {
        next(err, page);
      });
    },
    function populateAuthors(page, next) {
      if (!page) {
        return next(null, page);
      }
      User.find()
        .where('_id').in(page.authorIds)
        .exec(function(err, users) {
          if (err) {
            return next(err);
          }
          page.authors = users;
          next(null, page);
        });
    }
  ], callback);
};