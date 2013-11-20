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

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addMasterIdValidators(schema);
  addUserIdValidators(schema);
  addTypeValidators(schema);
  addTopicIdValidators(schema);
  addMasterCommentIdValidators(schema);
  addCommentIdValidators(schema);
};

/**
 * Adds validators on `masterId` path
 * @param {Mongoose.Schema} schema
 */
function addMasterIdValidators(schema) {
  schema.path('masterId')
    .required(true, '必须提供被提醒方 id!')
    .validate(function(masterId) {
      try {
        masterId = new ObjectId(masterId);
      } catch (e) {
        return false;
      }
      return true;
    }, '被提醒方 id 不是有效的用户 id!');
}

/**
 * Adds validators on `userId` path
 * @param {Mongoose.Schema} schema
 */
function addUserIdValidators(schema) {
  schema.path('userId')
    .required(true, '必须提供用户 id!')
    .validate(function(userId) {
      try {
        userId = new ObjectId(userId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的用户 id!');
}

/**
 * Adds validators on `type` path
 * @param {Mongoose.Schema} schema
 */
function addTypeValidators(schema) {
  schema.path('type')
    .required(true, '必须提供提醒类型!')
    .enum({
      values: _.values(constants.NOTIFICATION_TYPE),
      message: '不是有效的提醒类型!'
    });
}

/**
 * Adds validators on `topicId` path
 * @param {Mongoose.Schema} schema
 */
function addTopicIdValidators(schema) {
  schema.path('topicId')
    .validate(function(topicId) {
      try {
        topicId = new ObjectId(topicId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的话题 id!');
}

/**
 * Adds validators on `masterCommentId` path
 * @param {Mongoose.Schema} schema
 */
function addMasterCommentIdValidators(schema) {
  schema.path('masterCommentId')
    .validate(function(masterCommentId) {
      try {
        masterCommentId = new ObjectId(masterCommentId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的评论 id!');
}

/**
 * Adds validators on `commentId` path
 * @param {Mongoose.Schema} schema
 */
function addCommentIdValidators(schema) {
  schema.path('commentId')
    .validate(function(commentId) {
      try {
        commentId = new ObjectId(commentId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的评论 id!');
}