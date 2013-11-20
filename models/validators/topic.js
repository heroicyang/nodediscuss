/**
 * Adds validators to TopicSchema
 * @author heroic
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
  addTitleValidators(schema);
  addTagValidators(schema);
  addAuthorValidators(schema);
};

/**
 * Adds validators on `title` path
 * @param {Mongoose.Schema} schema
 */
function addTitleValidators(schema) {
  schema.path('title')
    .required(true, '标题必填!')
    .validate(function(title) {
      return title.length >= 10;
    }, '标题至少为10个字符。')
    .validate(function(title) {
      return title.length <= 100;
    }, '标题最多为100个字符。');
}

/**
 * Adds validators on `tag.id` path
 * @param {Mongoose.Schema} schema
 */
function addTagValidators(schema) {
  schema.path('tag.id')
    .required(true, '节点不能为空!')
    .validate(function(tagId) {
      try {
        tagId = new ObjectId(tagId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的节点 id!')
    .validate(function(tagId, done) {
      var Tag = this.model('Tag'),
        self = this;
      
      Tag.findById(tagId, function(err, tag) {
        if (err || !tag) {
          return done(false);
        }

        _.extend(self.tag, {
          name: tag.name
        });
        done(true);
      });
    }, '该节点不存在。');
}

/**
 * Adds validators on `author.id` path
 * @param {Mongoose.Schema} schema
 */
function addAuthorValidators(schema) {
  schema.path('author.id')
    .required(true, '必须提供作者 id!')
    .validate(function(authorId) {
      try {
        authorId = new ObjectId(authorId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的作者 id!')
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
    }, '该作者不存在。');
}