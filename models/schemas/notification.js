/**
 * NotificationSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `notification`
 * @type {Schema}
 */
var NotificationSchema = new Schema({
  masterId: {
    type: String,
    required: true,
    index: true
  },
  userId: String,
  type: String,
  topicId: String,
  masterCommentId: String,
  commentId: String,
  hasRead: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'notification'
});

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: NotificationSchema,
  modelName: 'Notification'
};