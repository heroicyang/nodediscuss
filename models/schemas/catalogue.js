/**
 * CatalogueSchema definition
 * 本来是叫节点的，但是一看到这文件名 `node.js` 就有点难受啊
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `node`
 * @type {Schema}
 */
var CatalogueSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  section: String,
  describe: String,
  topicCount: {
    type: Number,
    default: 0
  },
  favoriteUserCount: {
    type: Number,
    default: 0
  }
}, {
  collection: 'catalogue'
});

/**
 * Plugins
 */
CatalogueSchema
  .plugin(require('../mongoose_plugins/timestamp'));

/**
 * Exports schema and model name
 * @type {object}
 */
module.exports = {
  schema: CatalogueSchema,
  modelName: 'Catalogue'
};