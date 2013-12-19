/**
 * Attach some behavior for Schema. Such as validators, hooks, methods, statics
 * Then, register and export models
 * @author heroic
 */

/**
 * Module dependencies
 */
var fs = require('fs'),
  join = require('path').join;
var glob = require('glob'),
  mongoose = require('mongoose'),
  _ = require('lodash');
var timestampPlugin = require('./mongoose_plugins/timestamp'),
  paginationPlugin = require('./mongoose_plugins/pagination');
var api = {};

// Declares a global plugin executed on all Schemas
mongoose.plugin(timestampPlugin());
mongoose.plugin(paginationPlugin({
  defaultSort: { createdAt: -1 }
}));

if (!mongoose.modelNames().length) {
  registerModels();
  apiWrapper(api);
}

module.exports = exports = mongoose.models;

/** 对外暴露 api 方法 */
exports.api = api;

/** 对外暴露 model 层中的常量 */
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

/** 将 `models/methods/class` 中定义的方法包装成 API 接口 */
function apiWrapper(exports) {
  exports = exports || Object.create(null);
  _.each(mongoose.models, function(model, modelName) {
    var api = exports[modelName] = exports[modelName] || {};
    var classMethodNames = _.keys(model.schema.statics);

    _.each(classMethodNames, function(classMethodName) {
      api[classMethodName] = _.bind(model[classMethodName], model);
    });
  });
  return exports;
}