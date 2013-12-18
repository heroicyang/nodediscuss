/**
 * PageSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('../sanitize');

module.exports = exports = function(schema) {
  // 执行数据验证之前
  schema
    .pre('validate', function(next) {
      sanitize(this, ['title', 'content']);
      next();
    });

  // 执行数据保存之前
  schema
    .pre('save', function(next) {
      // 每次编辑页面之后增加其版本号
      if (!this.isNew) {
        this.version += 1;
      }
      next();
    });
};