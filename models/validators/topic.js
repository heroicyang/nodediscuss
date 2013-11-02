/**
 * Adds validators to TopicSchema
 * @author heroic
 */

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addTitleValidators(schema);
};

/**
 * Adds validators on `title` path
 * @param {Mongoose.Schema} schema
 */
function addTitleValidators(schema) {
  schema.path('title')
    .validate(function(title) {
      return title.length >= 10;
    }, 'Title must be at least 10 characters.')
    .validate(function(title) {
      return title.length <= 100;
    }, 'Title must be less than 100 characters.');
}