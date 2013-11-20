/**
 * Adds validators to SectionSchema
 * @author  heroic
 */

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addNameValidators(schema);
};

/**
 * Adds validators on `name` path
 * @param {Mongoose.Schema} schema
 */
function addNameValidators(schema) {
  schema.path('name')
    .required(true, '节点组名称必填!');
}