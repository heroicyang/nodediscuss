/**
 * TagSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async');
var xss = require('../xss');

module.exports = exports = function(schema) {
  // 执行数据验证之前
  schema
    .pre('validate', function(next) {
      xss(this, ['name', 'describe']);

      // 如果没有提供节点地址，则使用节点名，但要做过滤操作
      if (!this.slug) {
        this.slug = this.name
          .replace(/\-+/g, ' ')
          .replace(/^\s+|\s+$/g, '')
          .replace(/^\-|\-$/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9 \-_]/g, ' ')
          .replace(/\s+/g, '-');
      }
      next();
    });

  // 执行数据保存前
  schema
    .pre('save', true, function(next, done) {
      next();
      // 如果更新了节点的地址和名称，则同步更新其相应话题的 tag 副本信息
      if (this.isNew) { return done(); }
      if (!this.isModified('slug') && !this.isModified('name')) {
        return done();
      }

      var Topic = this.model('Topic');
      Topic.update({
        'tag.id': this.id
      }, {
        'tag.name': this.name,
        'tag.slug': this.slug,
      }, {
        multi: true
      }, done);
    });

  // 执行数据删除前
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 删除节点时应该同时删除它下面的所有话题
      // 节点的删除操作只有管理员才可以进行
      
      var Topic = this.model('Topic');
      Topic.find({
        'tag.id': this.id
      }, function(err, topics) {
        if (err) {
          return done(err);
        }

        async.each(topics, function(topic, next) {
          topic.remove(next);
        }, done);
      });
    });
};