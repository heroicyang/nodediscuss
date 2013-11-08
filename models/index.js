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
  mongoose = require('mongoose');

if (!mongoose.modelNames().length) {
  registerModels();
}

module.exports = exports = mongoose.models;

/**
 * 定义 model 中会用到的常量，并将其暴露出去
 * @type {Object}
 */
exports.constants = {};
defineConstant(exports.constants, {
  // 通知类型
  NITIFICATION_TYPE: {
    COMMENT: 1,         // 某人评论了你的话题
    REPLY_COMMENT: 2,   // 某人回复了你的评论
    FOLLOW: 3,          // 某人关注了你
    AT: 4               // 某人@了你
  }
});

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

/**
 * 定义常量，真正意义上的常量，只可读不可写
 * @param  {Object} object  用于绑定常量的对象
 * @param  {String} name    常量名称
 * @param  {[type]} value   常量值
 * @return {Object}         绑定常量的对象
 */
function defineConstant(object, name, value) {
  var key;

  // 如果传入的第二个参数为一个对象，则遍历该对象进行常量定义
  if (typeof name === 'object') {
    for (key in name) {
      if (name.hasOwnProperty(key)) {
        defineConstant(object, key, name[key]);
      }
    }
  } else {
    Object.defineProperty(object, name, {
      value:        value,
      enumerable:   true,
      writable:     false,
      configurable: false
    });
  }

  return object;
}