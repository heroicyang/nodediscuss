/**
 * PageSchema 定义
 * 保存单一的文档页面，比如 wiki
 * @author  heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `page`
 * @type {Schema}
 */
var PageSchema = new Schema({
  slug: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  contentHtml: String,
  authors: [{
    id: {
      type: String,
      index: true,
      required: true
    },
    username: String,
    nickname: String,
    avatar: String
  }],
  commentCount: {
    type: Number,
    default: 0
  }
}, {
  collection: 'page'
});

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: PageSchema,
  modelName: 'Page'
};