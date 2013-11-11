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

exports.findById = function(id, callback) {
  return User.findById(id, callback);
};

exports.findByUsername = function(username, callback) {
  return User.findByUsername(username, callback);
};

exports.findByEmail = function(email, callback) {
  return User.findByEmail(email, callback);
};

exports.check = function(email, password, callback) {
  return User.check({
    email: email,
    password: password
  }, callback);
};