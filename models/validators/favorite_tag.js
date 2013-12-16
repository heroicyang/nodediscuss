/**
 * Adds validator to FavoriteTagSchema
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
  addUserIdValidators(schema);
  addTagValidators(schema);
};

/**
 * Adds validators on `userId` path
 * @param {Mongoose.Schema} schema
 */
function addUserIdValidators(schema) {
  schema.path('userId')
    .required(true, '必须提供用户 id!')
    .validate(function(userId) {
      try {
        userId = new ObjectId(userId);
      } catch (e) {
        return false;
      }
      return true;
    }, '不是有效的用户 id!');
}

/**
 * Adds validators on `tag.id` path
 * @param {Mongoose.Schema} schema
 */
function addTagValidators(schema) {
  schema.path('tag.id')
    .required(true, '必须提供节点 id!')
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
          name: tag.name,
          slug: tag.slug
        });
        done(true);
      });
    }, '节点不存在。');
}