/**
 * 暴露 User 相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  User = models.User;

exports.create = function(userData, callback) {
  return User.create(userData, callback);
};