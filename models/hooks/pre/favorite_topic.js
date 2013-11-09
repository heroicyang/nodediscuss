/**
 * 定义FavoriteTopicSchema 的 pre-hooks
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
    .pre('save', true, when('isNew').then(incFavoriteTopicCountOfUser))
    .pre('save', true, when('isNew').then(incFavoriteUserCountOfTopic))
    .pre('remove', true, decFavoriteTopicCountOfUser)
    .pre('remove', true, decFavoriteUserCountOfTopic);
};

/**
 * 增加对应用户的 favoriteTopicCount 值
 */
function incFavoriteTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteTopicCount: 1
    }
  }, done);
}

/**
 * 增加对应话题的 favoriteUserCount 值
 */
function incFavoriteUserCountOfTopic(next, done) {
  next();

  var Topic = this.model('Topic');
  Topic.findByIdAndUpdate(this.topicId, {
    $inc: {
      favoriteUserCount: 1
    }
  }, done);
}

/**
 * 减少对应用户的 favoriteTopicCount 值
 */
function decFavoriteTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteTopicCount: -1
    }
  }, done);
}

/**
 * 减少对应话题的 favoriteUserCount 值
 */
function decFavoriteUserCountOfTopic(next, done) {
  next();

  var Topic = this.model('Topic');
  Topic.findByIdAndUpdate(this.topicId, {
    $inc: {
      favoriteUserCount: -1
    }
  }, done);
}