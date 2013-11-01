/**
 * FavoriteTopicSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `favorite_topic`
 * @type {Schema}
 */
var FavoriteTopicSchema = new Schema({
  userId: {
    type: String,
    index: true,
    required: true
  },
  topicId: {
    type: String,
    required: true
  }
}, {
  collection: 'favorite_topic'
});

/**
 * Plugins
 */
FavoriteTopicSchema
  .plugin(require('../mongoose_plugins/timestamp'));

/**
 * Exports schema and model name
 * @type {object}
 */
module.exports = {
  schema: FavoriteTopicSchema,
  modelName: 'FavoriteTopic'
};