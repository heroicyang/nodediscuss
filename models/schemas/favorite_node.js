/**
 * FavoriteNodeSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `favorite_node`
 * @type {Schema}
 */
var FavoriteNodeSchema = new Schema({
  userId: {
    type: String,
    index: true,
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
  }
}, {
  collection: 'favorite_node'
});

/**
 * Plugins
 */
FavoriteNodeSchema
  .plugin(require('../mongoose_plugins/timestamp'));

/**
 * Exports schema and model name
 * @type {object}
 */
module.exports = {
  schema: FavoriteNodeSchema,
  modelName: 'FavoriteNode'
};