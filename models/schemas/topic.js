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
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  node: {
    id: {
      type: String,
      require: true
    },
    name: {
      type: String,
      required: true
    }
  },
  author: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    }
  },
  lastCommentUser: {
    id: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    commentedAt: {
      type: Date,
      required: true
    }
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
  favoriteUserCount: {
    type: Number,
    default: 0
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