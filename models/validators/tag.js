/**
 * Adds validators to TagSchema
 * @author  heroic
 */

 /**
  * Module dependencies
  */
var _ = require('lodash');
var validator = require('../validator');

module.exports = exports = function(schema) {
  // 验证节点地址的有效性
  schema.path('slug')
    .required(true, '节点地址不能为空!')
    .match(/^[a-z0-9\-_]+$/, '节点地址只能为字母、数字、横线和下划线。')
    .validate(function(slug, done) {
      var Tag = this.model('Tag'),
        self = this;
      Tag.findOne({
        slug: slug
      }, function(err, tag) {
        if (err) {
          return done(false);
        }
        if (tag) {
          return done(tag.id === self.id);
        }
        done(true);
      });
    }, '该节点地址已被使用。');

  // 验证节点名称
  schema.path('name')
    .required(true, '节点名称必填!');

  // 验证节点所属的节点组
  schema.path('section.id')
    .required(true, '必须选择所属节点组!')
    .validate(function(sectionId) {
      return validator.isObjectId(sectionId);
    }, 'Invalid section id.')    // 外键检查，不会直接显示给用户
    .validate(function(sectionId, done) {
      var Section = this.model('Section'),
        self = this;

      Section.findById(sectionId, function(err, section) {
        if (err || !section) {
          return done(false);
        }

        // 将节点组副本信息保存到该节点，加快查询操作
        _.extend(self.section, {
          name: section.name,
          sort: section.sort
        });
        done(true);
      });
    }, '所选择的节点组不存在。');
};