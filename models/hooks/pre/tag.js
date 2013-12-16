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
    .pre('validate', function(next) {
      this.name = sanitize(this.name).xss();
      if (!this.slug) {
        this.slug = this.name
          .replace(/\-+/g, ' ')
          .replace(/^\s+|\s+$/g, '')
          .replace(/^\-|\-$/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5 \-_]/g, ' ')
          .replace(/\s+/g, '-');
      }
      if (this.describe) {
        this.describe = sanitize(this.describe).xss();
      }
      next();
    });

  schema
    .pre('save', true, function(next, done) {
      next();
      if (this.isNew ||
            (!this.isModified('name') && !this.isModified('slug'))) {
        return done();
      }

      // 更新节点后同步更新到相应的话题
      var Topic = this.model('Topic');
      Topic.update({
        'tag.id': this.id
      }, {
        'tag.name': this.name,
        'tag.slug': this.slug,
      }, {
        multi: true
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      if (this.isNew ||
            (!this.isModified('name') && !this.isModified('slug'))) {
        return done();
      }

      // 更新节点后同步更新到相应的节点收藏
      var FavoriteTag = this.model('FavoriteTag');
      FavoriteTag.update({
        'tag.id': this.id
      }, {
        'tag.name': this.name,
        'tag.slug': this.slug,
      }, {
        multi: true
      }, done);
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