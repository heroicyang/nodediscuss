/**
 * Timestamp plugin
 * Generate `createdAt` and `updatedAt` field for mongo document
 * @author heroic
 */

/**
 * Expose plugin
 * @param  {Object} options
 * @return {Function} mongoose plugin function
 */
module.exports = exports = function(options) {
  options = options || {};

  var createdAtPath = options.createdAtPath || 'createdAt',
    updatedAtPath = options.updatedAtPath || 'updatedAt',
    useVirtual = (undefined !== options.useVirtual) ?
        options.useVirtual : false;

  return function(schema) {
    var paths = {};

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
};