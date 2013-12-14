/**
 * 定义 TagSchema 的 pre-hooks
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
      if (this.describe) {
        this.describe = sanitize(this.describe).xss();
      }
      next();
    })
    .pre('save', function(next) {
      if (this.isNew || !this.isModified('name')) {
        return next();
      }

      // 更新节点名后同步更新到相应的话题
      var Topic = this.model('Topic');
      Topic.update({
        'tag.id': this.id
      }, {
        'tag.name': this.name
      }, {
        multi: true
      }, next);
    });

  schema
    .pre('remove', function(next) {
      // 删除一个节点时清空该节点下面的所有话题
      // 此操作只有管理员才可以进行，但仍需谨慎
      var Topic = this.model('Topic');
      Topic.find({
        'tag.id': this.id
      }, function(err, topics) {
        if (err) {
          return next(err);
        }

        async.each(topics, function(topic, next) {
          topic.remove(next);
        }, next);
      });
    });
};