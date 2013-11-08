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
 * Collection name in the database is `favorite_catalogue`
 * @type {Schema}
 */
var FavoriteNodeSchema = new Schema({
  userId: {
    type: String,
    index: true,
    required: true
  },
  catalogue: {
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
  collection: 'favorite_catalogue'
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
  modelName: 'FavoriteCatalogue'
};