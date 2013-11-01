/**
 * Exports timestamp plugin
 * @param  {Mongoose.Schema} schema
 * @param  {object} options 
 */
module.exports = function(schema, options) {
  options = options || {};

  var paths = {},
    createdAtPath = options.createdAtPath || 'createdAt',
    updatedAtPath = options.updatedAtPath || 'updatedAt',
    useVirtual = (undefined !== options.useVirtual) ?
        options.useVirtual : false;

  if (!schema.paths[updatedAtPath]) {
    paths[updatedAtPath] = {
      type: Date
    };
  }

  if (useVirtual) {
    schema.virtual(createdAtPath)
      .get(function() {
        return new Date(this._id.generationTime * 1000);
      });
  } else if (!schema.paths[createdAtPath]) {
    paths[createdAtPath] = {
      type: Date,
      default: Date.now
    };
  }

  schema.add(paths);

  schema.pre('save', function(next) {
    this[updatedAtPath] = new Date();
    next();
  });
};