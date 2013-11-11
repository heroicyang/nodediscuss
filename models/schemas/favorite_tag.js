/**
 * FavoriteTagSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `favorite_tag`
 * @type {Schema}
 */
var FavoriteTagSchema = new Schema({
  userId: {
    type: String,
    index: true,
    required: true
  },
  tag: {
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
  collection: 'favorite_tag'
});

/**
 * Exports schema and model name
 * @type {object}
 */
module.exports = {
  schema: FavoriteTagSchema,
  modelName: 'FavoriteTag'
};