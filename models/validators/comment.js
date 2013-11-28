/**
 * Adds validators to CommentSchema
 * @author  heroic
 */

/**
 * Module dependencies
 */
var ObjectId = require('mongoose').Types.ObjectId,
  _ = require('lodash');

/**
 * Bootstrap
 * @param {Mongoose.Schema} schema
 * @return {Function}
 */
module.exports = exports = function(schema) {
  addTopicIdValidators(schema);
  addContentValidators(schema);
  addAuthorValidators(schema);
};

/**
 * Adds validators on `topicId` path
 * @param {Mongoose.Schema} schema
 */
function addTopicIdValidators(schema) {
  schema.path('topicId')
    .required(true, '必须提供话题 id!')
    .validate(function(topicId) {
      try {
        topicId = new ObjectId(topicId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的话题 id!');
}

/**
 * Adds validators on `content` path
 * @param {Mongoose.Schema} schema
 */
function addContentValidators(schema) {
  schema.path('content')
    .required(true, '评论内容不能为空!')
    .validate(function(content, done) {
      // 如果触发本次验证是对 comment 进行软删除，那就直接跳过
      if (this.deleted) {
        return done(true);
      }

      var Comment = this.model('Comment');

      Comment.find({
        topicId: this.topicId,
        'author.id': this.author.id,
        deleted: false
      }, function(err, comments) {
        if (err) {
          return done(false);
        }

        var repeated = false;
        if (comments.length) {
          _.each(comments, function(comment) {
            if (comment.content === content) {
              repeated = true;
              return;
            }
          });
        }

        done(!repeated);
      });
    }, '不能发表重复评论!');
}

/**
 * Adds validators on `author.id` path
 * @param {Mongoose.Schema} schema
 */
function addAuthorValidators(schema) {
  schema.path('author.id')
    .required(true, '必须提供评论用户 id!')
    .validate(function(authorId) {
      try {
        authorId = new ObjectId(authorId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的用户 id!')
    .validate(function(authorId, done) {
      var User = this.model('User'),
        self = this;

      User.findById(authorId, function(err, user) {
        if (err || !user) {
          return done(false);
        }

        _.extend(self.author, {
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar
        });
        done(true);
      });
    }, '评论用户不存在。');
}