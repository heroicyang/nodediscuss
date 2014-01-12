/**
 * Adds validators to NotificationSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var validator = require('../validator'),
  constants = require('../constants');

module.exports = exports = function(schema) {
  schema.path('masterId')
    .required(true)
    .validate(function(masterId) {
      return validator.isObjectId(masterId);
    }, 'Invalid master user id.');

  schema.path('userId')
    .required(true)
    .validate(function(userId) {
      return validator.isObjectId(userId);
    }, 'Invalid user id.');
  
  schema.path('type')
    .required(true)
    .enum({ values: _.values(constants.NOTIFICATION_TYPE) });
  
  schema.path('topicId')
    .validate(function(topicId) {
      return validator.isObjectId(topicId);
    }, 'Invalid topic id.');
  
  schema.path('masterCommentId')
    .validate(function(masterCommentId) {
      return validator.isObjectId(masterCommentId);
    }, 'Invalid master comment id.');
  
  schema.path('commentId')
    .validate(function(commentId) {
      return validator.isObjectId(commentId);
    }, 'Invalid comment id.');
};