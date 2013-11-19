/**
 * 提醒相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  Notification = models.Notification;

exports.query = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var query = Notification.find().lean(),
    conditions = options.conditions || {},
    pageIndex = options.pageIndex || 1,
    pageSize = options.pageSize || 20,
    fields = options.fields || null,
    sort = options.sort || {
      createdAt: -1
    };

  query = query.find(conditions).sort(sort);

  if (fields) {
    query = query.select(fields);
  }

  query = query.skip((pageIndex - 1) * pageSize).limit(pageSize);

  query.exec(callback);
};