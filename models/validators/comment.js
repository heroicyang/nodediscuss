/**
 * Adds validators to CommentSchema
 * @author  heroic
 */

/**
 * Module dependencies
 */
var ObjectId = require('mongoose').Types.ObjectId,
  _ = require('lodash');

module.exports = exports = function(schema) {
  // 对关联的话题或页面 id 进行约束性检查
  schema.path('refId')
    .required(true)
    .validate(function(refId) {
      try {
        refId = new ObjectId(refId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid ref id.');

  // 验证评论内容的有效性
  schema.path('content')
    .required(true, '评论内容不能为空!')
    .validate(function(content, done) {
      var Comment = this.model('Comment');
      Comment.find({
        refId: this.refId,
        'author.id': this.author.id,
        deleted: false
      }, function(err, comments) {
        if (err) {
          return done(false);
        }

        done(!_.find(comments, function(comment) {
          return comment.content === content;
        }));
      });
    }, '不能发表重复评论!');

  // 对评论的 `author.id` 进行约束性检查，以及拷贝用户信息副本到评论对象
  schema.path('author.id')
    .required(true)
    .validate(function(authorId) {
      try {
        authorId = new ObjectId(authorId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid author id.')
    .validate(function(authorId, done) {
      var User = this.model('User'),
        self = this;

      User.findById(authorId, function(err, user) {
        if (err || !user) {
          return done(false);
        }
        // 将用户信息拷贝到评论的 author 副本中
        _.extend(self.author, {
          username: user.username,
          nickname: user.nickname,
          emailHash: user.emailHash
        });
        done(true);
      });
    }, 'The comment user does not exist!');
};