/**
 * Adds validator to FavoriteTopicSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addUserIdValidators(schema);
  addTopicIdValidators(schema);
};

/**
 * Adds validators on `userId` path
 * @param {Mongoose.Schema} schema
 */
function addUserIdValidators(schema) {
  schema.path('userId')
    .required(true, 'A user id is required!')
    .validate(function(userId) {
      try {
        userId = new ObjectId(userId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid user id!');
}

/**
 * Adds validators on `topicId` path
 * @param {Mongoose.Schema} schema
 */
function addTopicIdValidators(schema) {
  schema.path('topicId')
    .required(true, 'A topic id is required!')
    .validate(function(topicId) {
      try {
        topicId = new ObjectId(topicId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid topic id!');
}