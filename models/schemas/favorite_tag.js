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
    index: true
  },
  tag: {
    id: String,
    slug: String,
    name: String
  }
}, {
  collection: 'favorite_tag'
});

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: FavoriteTagSchema,
  modelName: 'FavoriteTag'
};