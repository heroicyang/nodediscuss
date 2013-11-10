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
    .pre('save', true, when('isNew').then(increaseFavoriteTopicCountOfUser))
    .pre('save', true, when('isNew').then(increaseFavoriteCountOfTopic))
    .pre('remove', true, decreaseFavoriteTopicCountOfUser)
    .pre('remove', true, decreaseFavoriteCountOfTopic);
};

/**
 * 增加对应用户的 favoriteTopicCount 值
 */
function increaseFavoriteTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteTopicCount: 1
    }
  }, done);
}

/**
 * 增加对应话题的 favoriteCount 值
 */
function increaseFavoriteCountOfTopic(next, done) {
  next();

  var Topic = this.model('Topic');
  Topic.findByIdAndUpdate(this.topicId, {
    $inc: {
      favoriteCount: 1
    }
  }, done);
}

/**
 * 减少对应用户的 favoriteTopicCount 值
 */
function decreaseFavoriteTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.userId, {
    $inc: {
      favoriteTopicCount: -1
    }
  }, done);
}

/**
 * 减少对应话题的 favoriteCount 值
 */
function decreaseFavoriteCountOfTopic(next, done) {
  next();

  var Topic = this.model('Topic');
  Topic.findByIdAndUpdate(this.topicId, {
    $inc: {
      favoriteCount: -1
    }
  }, done);
}