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
  // 对应的 Topic 或 Page 的 id
  refId: {
    type: String,
    index: true
  },
  // 当设置为 true 时代表评论 Page
  onPage: {
    type: Boolean,
    default: false
  },
  // 被回复评论的 id
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
    emailHash: String
  },
  floor: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  // 评论只做软删除，以便界面上显示连续的评论楼层
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