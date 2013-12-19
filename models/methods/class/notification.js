/**
 * Notification 类方法
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 获取通知数据
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - notPaged       optional   不分页则传入 true，默认 false
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - count          记录总数
 *  - notifications  通知数据
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || options.conditions || {};
  options = _.omit(options, ['query', 'conditions']);
  this.paginate(conditions, options, callback);
};

/**
 * 根据条件统计通知数量
 * @param  {Object}   conditions   查询条件
 * @param  {Function} callback
 *  - err
 *  - count
 */
exports.count = function(conditions, callback) {
  this.count(conditions, callback);
};

/**
 * 根据条件将通知标记为已读
 * @param  {Object}   conditions  查询条件
 * @param  {Function} callback
 *  - err
 */
exports.read = function(conditions, callback) {
  conditions = conditions || {};
  conditions.read = false;

  this.update(conditions, {
    read: true
  }, {
    multi: true
  }, function(err) {
    callback(err);
  });
};