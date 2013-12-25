/**
 * Adds validators to TopicSchema
 * @author heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var validate = require('../validate');

module.exports = exports = function(schema) {
  // 验证话题标题的有效性
  schema.path('title')
    .required(true, '必须填写话题标题!')
    .validate(function(title) {
      return title.length <= 100;
    }, '标题只能在 100 个字符以内。');

  // 验证话题所属的节点
  schema.path('tag.id')
    .required(true, '必须选择话题所属的节点!')
    .validate(function(tagId) {
      return !!validate(tagId).isObjectId();
    }, 'Invalid tag id.')    // 外键检查，不会直接显示给用户
    .validate(function(tagId, done) {
      var Tag = this.model('Tag'),
        self = this;
      
      Tag.findById(tagId, function(err, tag) {
        if (err || !tag) {
          return done(false);
        }

        // 将节点副本信息保存到该话题，加快查询操作
        _.extend(self.tag, {
          name: tag.name,
          slug: tag.slug
        });
        done(true);
      });
    }, '所选择的节点不存在。');

  // 非用户输入性验证，所以错误提示信息不会直接显示给用户
  // 验证话题发布作者
  schema.path('author.id')
    .required(true)
    .validate(function(authorId) {
      return !!validate(authorId).isObjectId();
    }, 'Invalid user id.')
    .validate(function(authorId, done) {
      var User = this.model('User'),
        self = this;

      User.findById(authorId, function(err, user) {
        if (err || !user) {
          return done(false);
        }
        // 将用户副本信息保存到该话题，加快查询操作
        _.extend(self.author, {
          username: user.username,
          nickname: user.nickname,
          emailHash: user.emailHash
        });
        done(true);
      });
    }, 'The author does not exist!');
};