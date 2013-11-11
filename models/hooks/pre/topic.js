/**
 * 为 TopicSchema 定义 pre-hooks
 * @author heroic
 */

/**
* Module dependencies
*/
var sanitize = require('validator').sanitize,
  async = require('async'),
  when = require('../when');

/**
* Bootstrap
* @param  {Mongoose.Schema} schema
*/
module.exports = exports = function(schema) {
  schema
   .pre('validate', processTopicData)
   .pre('save', true, when('isNew').then(increaseTopicCountOfUser))
   .pre('save', true, when('isNew').then(increaseTopicCountOfTag))
   .pre('remove', true, decreaseTopicCountOfUser)
   .pre('remove', true, decreaseTopicCountOfTag)
   .pre('remove', true, removeComments)
   .pre('remove', true, removeFormFavorites);
};

/**
 * 处理输入的话题数据，XSS 防范
 */
function processTopicData(next) {
  this.title = sanitize(this.title).xss();
  this.content = sanitize(this.content).xss();
  next();
}

/**
 * 更新 user 的 topicCount 属性，每发布一条 topic 则递增
 */
function increaseTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.author.id, {
    $inc: {
      topicCount: 1
    }
  }, done);
}

/**
 * 更新 tag 的 topicCount 属性，每发布一条 topic 则递增
 */
function increaseTopicCountOfTag(next, done) {
  next();

  var Tag = this.model('Tag');
  Tag.findByIdAndUpdate(this.tag.id, {
    $inc: {
      topicCount: 1
    }
  }, done);
}

/**
 * 删除 topic 时减少 user 的 topicCount 值
 */
function decreaseTopicCountOfUser(next, done) {
  next();

  var User = this.model('User');
  User.findByIdAndUpdate(this.author.id, {
    $inc: {
      topicCount: -1
    }
  }, done);
}

/**
 * 删除 topic 时减少 tag 的 topicCount 值
 */
function decreaseTopicCountOfTag(next, done) {
  next();

  var Tag = this.model('Tag');
  Tag.findByIdAndUpdate(this.tag.id, {
    $inc: {
      topicCount: -1
    }
  }, done);
}

/**
 * 删除 topic 时删除其对应的 comments
 */
function removeComments(next, done) {
  next();

  var Comment = this.model('Comment');
  Comment.remove({
    topicId: this.id
  }, done);
}

/**
 * 删除 topic 时，把该 topic 从别人的收藏里面移除
 */
function removeFormFavorites(next, done) {
  next();

  var FavoriteTopic = this.model('FavoriteTopic');
  FavoriteTopic.find({
    topicId: this.id
  }, function(err, favoriteTopics) {
    if (err) {
      return done(err);
    }
    // Why do?
    // 在删除 FavoriteTopic 时需要执行它的中间件(pre-hooks)，
    // 用以减少对应 user 中的 topicFavoriteCount 值,
    // 所以需要调用 Model 的实例对象的 remove 方法，而不是 Model.remove
    // 不过数据量大的话或许这里会存在性能问题，导致长时间没有响应客户端
    async.each(favoriteTopics, function(favoriteTopic, next) {
      favoriteTopic.remove(next);
    }, done);
  });
}