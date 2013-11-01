/**
 * NodeSchema definition
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
var NodeSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  category: String,
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
  collection: 'node'
});

/**
 * Plugins
 */
NodeSchema
  .plugin(require('../mongoose_plugins/timestamp'));

/**
 * Exports schema and model name
 * @type {object}
 */
module.exports = {
  schema: NodeSchema,
  modelName: 'Node'
};