/**
 * 通知中心相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  Notification = models.Notification;

/**
 * 获取通知列表
 * @param  {Object}   options
 *  - query          optional   查询条件，默认查询全部
 *  - pageIndex      optional   当前页数，默认 1
 *  - pageSize       optional   返回的记录数，默认 20
 *  - sort  {Object} optional   排序规则，默认按创建时间倒序
 * @param  {Function} callback
 *  - err
 *  - results
 *    - totalCount        符合查询条件通知记录总数
 *    - notifications     通知列表
 */
exports.query = function(options, callback) {
  options = options || {};
  var conditions = options.query || {},
    pageIndex = options.pageIndex,
    pageSize = options.pageSize,
    sort = options.sort || { createdAt: -1 };

  var q = Notification.query(conditions);
  q.query = q.query.sort(sort);
  q.paginate(pageIndex, pageSize)
    .exec(function(err, count, notifications) {
      callback(err, {
        totalCount: count,
        notifications: notifications
      });
    });
};