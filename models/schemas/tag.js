/**
 * TagSchema definition
 * 本来是打算叫节点（Node）的，但是一想到文件名要取为 `node.js` 就有点难受啊
 * 不过界面上还是叫节点吧，而且这个是不允许普通用户随意增删改的
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `tag`
 * @type {Schema}
 */
var TagSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  section: {
    id: {
      type: String,
      index: true
    },
    name: String
  },
  describe: String,
  topicCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  }
}, {
  collection: 'tag'
});

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: TagSchema,
  modelName: 'Tag'
};
