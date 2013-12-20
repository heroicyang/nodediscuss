/**
 * Adds validators to NotificationSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var ObjectId = require('mongoose').Types.ObjectId,
  _ = require('lodash'),
  constants = require('../constants');

module.exports = exports = function(schema) {
  schema.path('masterId')
    .required(true)
    .validate(function(masterId) {
      try {
        masterId = new ObjectId(masterId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid master user id.');

  schema.path('userId')
    .required(true)
    .validate(function(userId) {
      try {
        userId = new ObjectId(userId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid user id.');
  
  schema.path('type')
    .required(true)
    .enum({ values: _.values(constants.NOTIFICATION_TYPE) });
  
  schema.path('topicId')
    .validate(function(topicId) {
      try {
        topicId = new ObjectId(topicId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid topic id.');
  
  schema.path('masterCommentId')
    .validate(function(masterCommentId) {
      try {
        masterCommentId = new ObjectId(masterCommentId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid master comment id.');
  
  schema.path('commentId')
    .validate(function(commentId) {
      try {
        commentId = new ObjectId(commentId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid comment id.');
};