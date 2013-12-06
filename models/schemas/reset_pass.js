/**
 * 密码重置记录
 * @author heroic
 */

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection name in the database is `reset_pass`
 * @type {Schema}
 */
var ResetPassSchema = new Schema({
  userId: {
    type: String,
    index: true
  },
  email: String,
  token: {
    type: String,
    default: function() {
      return Math.round((new Date().valueOf() * Math.random())) + '';
    }
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  collection: 'reset_pass'
});

/**
 * Expose schema and model name
 * @type {object}
 */
module.exports = {
  schema: ResetPassSchema,
  modelName: 'ResetPass'
};