/**
 * NotificationSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('lodash'),
  constants = require('../constants');

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
  type: {
    type: Number,
    required: true,
    enum: _.values(constants.NOTIFICATION_TYPE)
  },
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
 * Plugins
 */
NotificationSchema
  .plugin(require('../mongoose_plugins/timestamp'));

/**
 * Exports schema and model name
 * @type {object}
 */
module.exports = {
  schema: NotificationSchema,
  modelName: 'Notification'
};