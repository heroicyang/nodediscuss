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
  contentHtml: String,
  tag: {
    id: {
      type: String,
      index: true
    },
    slug: String,
    name: String
  },
  author: {
    id: {
      type: String,
      index: true
    },
    username: String,
    nickname: String,
    emailHash: String
  },
  lastCommentUser: {
    username: String,
    nickname: String
  },
  lastCommentedAt: Date,

  views: {
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
  favoriteUsers: {
    type: Array,
    default: []
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
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: TopicSchema,
  modelName: 'Topic'
};