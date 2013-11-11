/**
 * TopicSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `topic`
 * @type {Schema}
 */
var TopicSchema = new Schema({
  title: {
    type: String,
    index: true
  },
  content: String,
  htmlContent: String,
  tag: {
    id: {
      type: String,
      index: true,
      require: true
    },
    name: String
  },
  author: {
    id: {
      type: String,
      index: true,
      require: true
    },
    username: String,
    nickname: String,
    avatar: String
  },
  lastCommentUser: {
    username: String,
    nickname: String,
    commentedAt: Date
  },

  viewsCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },

  excellent: {
    type: Boolean,
    default: false
  },
  top: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'topic'
});

/**
 * Plugins
 */
TopicSchema
  .plugin(require('../mongoose_plugins/timestamp'));

/**
 * Exports schema and model name
 * @type {object}
 */
module.exports = {
  schema: TopicSchema,
  modelName: 'Topic'
};