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
    lowercase: true,
    index: true,
    unique: true
  },
  title: {
    type: String,
    index: true
  },
  content: String,
  contentHtml: String,
  contributors: {
    type: Array,
    default: []
  },
  commentEnabled: {
    type: Boolean,
    default: true
  },
  commentCount: {
    type: Number,
    default: 0
  },
  version: {
    type: Number,
    default: 1
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