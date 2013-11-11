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
  timestampPlugin = require('./mongoose_plugins/timestamp');

// Declares a global plugin executed on all Schemas
mongoose.plugin(timestampPlugin());

if (!mongoose.modelNames().length) {
  registerModels();
}

module.exports = exports = mongoose.models;

/**
 * 将 model 中会用到的常量暴露出去
 * @type {Object}
 */
exports.constants = require('./constants');

/**
 * 将定义常量的方法也暴露出去
 * @type {Function}
 */
exports.defineConstant = exports.constants.define;

function registerModels() {
  var schemaPath = getFullPath('./schemas/');

  glob
    .sync('*.js', { cwd: schemaPath })
      .forEach(function(schemaFile) {
        var schemaInfo = require(join(schemaPath, schemaFile)),
          schema = schemaInfo.schema,
          modelName = schemaInfo.modelName,
          validatorPath = getFullPath('./validators/' + schemaFile),
          methodPath = getFullPath('./methods/method/' + schemaFile),
          staticMethodPath = getFullPath('./methods/static/' + schemaFile),
          preHookPath = getFullPath('./hooks/pre/' + schemaFile),
          postHookPath = getFullPath('./hooks/post/' + schemaFile);

        // Adds validators
        if (fs.existsSync(validatorPath)) {
          require(validatorPath)(schema);
        }

        // Adds instance methods
        if (fs.existsSync(methodPath)) {
          schema.method(require(methodPath));
        }

        // Adds static methods
        if (fs.existsSync(staticMethodPath)) {
          schema.static(require(staticMethodPath));
        }

        // Adds pre hooks
        if (fs.existsSync(preHookPath)) {
          require(preHookPath)(schema);
        }

        // Adds post hooks
        if (fs.existsSync(postHookPath)) {
          require(postHookPath)(schema);
        }

        // Registers mongoose model
        mongoose.model(modelName, schema);
      });
}

function getFullPath(p) {
  return join(__dirname, p);
}