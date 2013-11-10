/**
 * 定义 FavoriteTagSchema 的 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var when = require('../when');

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
   .pre('save', true, when('isNew').then(increaseFavoriteTagCountOfUser))
   .pre('save', true, when('isNew').then(increaseFavoriteCountOfTag))
   .pre('remove', true, decreaseFavoriteTagCountOfUser)
   .pre('remove', true, decreaseFavoriteCountOfTag);
};

/**
 * 增加对应用户的 favoriteTagCount 值
 */
function increaseFavoriteTagCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteTagCount: 1
    }
  }, done);
}

/**
 * 增加对应节点的 favoriteCount 值
 */
function increaseFavoriteCountOfTag(next, done) {
  next();

  var Tag = this.model('Tag');
  Tag.findByIdAndUpdate(this.tag.id, {
    $inc: {
      favoriteCount: 1
    }
  }, done);
}

/**
 * 减少对应用户的 favoriteTagCount 值
 */
function decreaseFavoriteTagCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteTagCount: -1
    }
  }, done);
}

/**
 * 减少对应节点的 favoriteCount 值
 */
function decreaseFavoriteCountOfTag(next, done) {
  next();

  var Tag = this.model('Tag');
  Tag.findByIdAndUpdate(this.tag.id, {
    $inc: {
      favoriteCount: -1
    }
  }, done);
}