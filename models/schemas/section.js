/**
 * SectionSchema definition
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `section`
 * @type {Schema}
 */
var SectionSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true
  },
  sort: {
    type: Number,
    default: 0
  }
}, {
  collection: 'section'
});

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: SectionSchema,
  modelName: 'Section'
};