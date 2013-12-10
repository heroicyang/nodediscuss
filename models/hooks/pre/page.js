/**
 * PageSchema pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var sanitize = require('validator').sanitize;

module.exports = exports = function(schema) {
  schema
    .pre('validate', function(next) {
      this.title = sanitize(this.title).xss();
      this.content = sanitize(this.content).xss();
      next();
    });

  schema
    .pre('save', function(next) {
      // 每次编辑后版本号增加
      if (!this.isNew) {
        this.version = this.version + 1;
        next();
      }
    });
};