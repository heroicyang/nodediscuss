/**
 * 节点组相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  models = require('../models'),
  Section = models.Section;

/**
 * 获取节点组列表
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount    符合查询条件节点组记录总数
 *    - sections        节点组列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || {},
    pageIndex = options.pageIndex,
    pageSize = options.pageSize,
    sort = options.sort;

  var q = Section.query(conditions);
  if (sort) {
    q.query = q.query.sort(sort);
  }
  // 代表不用分页
  if (pageSize === Infinity) {
    q.execQuery(function(err, sections) {
      callback(err, {
        sections: sections
      });
    });
  } else {
    q.paginate(pageIndex, pageSize)
      .exec(function(err, count, sections) {
        callback(err, {
          totalCount: count,
          sections: sections
        });
      });
  }
};