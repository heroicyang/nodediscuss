/**
 * 定义 SectionSchema 的 pre-hooks
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  sanitize = require('validator').sanitize;

/** Exports hooks */
module.exports = exports = function(schema) {
  schema
    .pre('save', function(next) {
      this.name = sanitize(this.name).xss();
      this.sort = parseInt(this.sort, 10);
      next();
    })
    .pre('save', function(next) {
      if (this.isNew || !this.isModified('name')) {
        return next();
      }

      // 更新节点组之后同步更新到相应节点
      var Tag = this.model('Tag');
      Tag.update({
        'section.id': this.id
      }, {
        'section.name': this.name
      }, {
        multi: true
      }, next);
    });

  schema
    .pre('remove', function(next) {
      // 删除一个节点组时清空该节点组下面的所有节点
      // 此操作只有管理员才可以进行，但仍需谨慎
      var Tag = this.model('Tag');
      Tag.find({
        'section.id': this.id
      }, function(err, tags) {
        if (err) {
          return next(err);
        }

        async.each(tags, function(tag, next) {
          tag.remove(next);
        }, next);
      });
    });
};