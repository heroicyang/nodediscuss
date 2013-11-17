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
    .required(true, 'A title is required!')
    .validate(function(title) {
      return title.length >= 10;
    }, 'Title must be at least 10 characters.')
    .validate(function(title) {
      return title.length <= 100;
    }, 'Title must be less than 100 characters.');
}

/**
 * Adds validators on `tag.id` path
 * @param {Mongoose.Schema} schema
 */
function addTagValidators(schema) {
  schema.path('tag.id')
    .required(true, 'Tag can not be blank!')
    .validate(function(tagId) {
      try {
        tagId = new ObjectId(tagId);
      } catch (e) {
        return false;
      }
      return true;
    }, 'Invalid tag id!')
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
    }, 'Tag does not exist.');
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