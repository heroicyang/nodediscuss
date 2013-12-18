/**
 * SectionSchema middlewares
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async');
var sanitize = require('../sanitize');

module.exports = exports = function(schema) {
  // 执行数据验证之前
  schema
    .pre('validate', function(next) {
      sanitize(this, 'name');
      next();
    });

  // 执行数据保存之前
  schema
    .pre('save', true, function(next, done) {
      next();
      // 如果更新了节点组的名称和排序，则同步更新其节点的 section 副本信息
      if (this.isNew) { return done(); }
      if (!this.isModified('name') && !this.isModified('sort')) {
        return done();
      }

      var Tag = this.model('Tag');
      Tag.update({
        'section.id': this.id
      }, {
        'section.name': this.name,
        'section.sort': this.sort
      }, {
        multi: true
      }, done);
    });

  // 执行数据删除之前
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 删除节点组时应该同时删除它下面的所有节点
      // 而删除节点时又会删除节点下的所有话题
      // 但节点组的删除操作只有管理员才可以进行
      var Tag = this.model('Tag');
      Tag.find({
        'section.id': this.id
      }, function(err, tags) {
        if (err) {
          return done(err);
        }

        async.each(tags, function(tag, next) {
          tag.remove(next);
        }, done);
      });
    });
};