/**
 * Attach some behavior for Schema. Such as validators, hooks, methods, statics
 * Then, register and export models
 * @author heroic
 */

/**
 * Module dependencies
 */
var fs = require('fs'),
  join = require('path').join,
  glob = require('glob'),
  mongoose = require('mongoose'),
  timestampPlugin = require('./mongoose_plugins/timestamp'),
  paginationPlugin = require('./mongoose_plugins/pagination');

// Declares a global plugin executed on all Schemas
mongoose.plugin(timestampPlugin());
mongoose.plugin(paginationPlugin({
  defaultSort: { createdAt: -1 }
}));

if (!mongoose.modelNames().length) {
  registerModels();
}

module.exports = exports = mongoose.models;

/**
 * 将 model 中会用到的常量暴露出去
 * @type {Object}
 */
exports.constants = require('./constants');

function registerModels() {
  var schemaPath = getFullPath('./schemas/');

  glob
    .sync('*.js', { cwd: schemaPath })
      .forEach(function(schemaFile) {
        var schemaInfo = require(join(schemaPath, schemaFile)),
          schema = schemaInfo.schema,
          modelName = schemaInfo.modelName,
          validatorPath = getFullPath('./validators/' + schemaFile),
          instanceMethodPath = getFullPath('./methods/instance/' + schemaFile),
          classMethodPath = getFullPath('./methods/class/' + schemaFile),
          middlewarePath = getFullPath('./middlewares/' + schemaFile);

        // Adds middlewares
        if (fs.existsSync(middlewarePath)) {
          require(middlewarePath)(schema);
        }

        // Adds validators
        if (fs.existsSync(validatorPath)) {
          require(validatorPath)(schema);
        }

        // Adds instance methods
        if (fs.existsSync(instanceMethodPath)) {
          schema.method(require(instanceMethodPath));
        }

        // Adds class methods
        if (fs.existsSync(classMethodPath)) {
          schema.static(require(classMethodPath));
        }

        // Registers mongoose model
        mongoose.model(modelName, schema);
      });
}

function getFullPath(p) {
  return join(__dirname, p);
}