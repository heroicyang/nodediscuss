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
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount    符合查询条件节点组记录总数
 *    - sections      节点组列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};

  Section.paginate(conditions, options, function(err, count, sections) {
    if (err) {
      return callback(err);
    }

    // `notPaged === true` 的情况
    if (typeof sections === 'undefined') {
      return callback(null, { sections: count });
    }

    callback(null, {
      totalCount: count,
      sections: sections
    });
  });
};