/**
 * CommentSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `comment`
 * @type {Schema}
 */
var CommentSchema = new Schema({
  // 所关联到的外键 id，即 Topic 或 Page 的 id
  fkId: {
    type: String,
    index: true
  },
  // 当评论 Page 时设为 true
  onPage: {
    type: Boolean,
    default: false
  },
  commentIds: [String],
  content: String,
  contentHtml: String,
  author: {
    id: {
      type: String,
      index: true
    },
    username: String,
    nickname: String,
    avatar: String
  },
  floor: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  // 评论只做软删除，以便应对回复楼层的上下文
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'comment'
});

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: CommentSchema,
  modelName: 'Comment'
};