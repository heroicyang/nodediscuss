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
    .required(true, 'A topic id is required!')
    .validate(function(topicId) {
      try {
        topicId = new ObjectId(topicId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid topic id!');
}

/**
 * Adds validators on `content` path
 * @param {Mongoose.Schema} schema
 */
function addContentValidators(schema) {
  schema.path('content')
    .required(true, 'Comment content is required!')
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
    }, 'Comment can not be repeated.');
}

/**
 * Adds validators on `author.id` path
 * @param {Mongoose.Schema} schema
 */
function addAuthorValidators(schema) {
  schema.path('author.id')
    .required(true, 'Author can not be blank!')
    .validate(function(authorId) {
      try {
        authorId = new ObjectId(authorId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid author id!')
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
    }, 'Author does not exist.');
}