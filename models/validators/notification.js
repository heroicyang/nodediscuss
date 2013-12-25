/**
 * Adds validators to NotificationSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var validate = require('../validate'),
  constants = require('../constants');

module.exports = exports = function(schema) {
  schema.path('masterId')
    .required(true)
    .validate(function(masterId) {
      return !!validate(masterId).isObjectId();
    }, 'Invalid master user id.');

  schema.path('userId')
    .required(true)
    .validate(function(userId) {
      return !!validate(userId).isObjectId();
    }, 'Invalid user id.');
  
  schema.path('type')
    .required(true)
    .enum({ values: _.values(constants.NOTIFICATION_TYPE) });
  
  schema.path('topicId')
    .validate(function(topicId) {
      return !!validate(topicId).isObjectId();
    }, 'Invalid topic id.');
  
  schema.path('masterCommentId')
    .validate(function(masterCommentId) {
      return !!validate(masterCommentId).isObjectId();
    }, 'Invalid master comment id.');
  
  schema.path('commentId')
    .validate(function(commentId) {
      return !!validate(commentId).isObjectId();
    }, 'Invalid comment id.');
};