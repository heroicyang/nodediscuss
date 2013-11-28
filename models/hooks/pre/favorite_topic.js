/**
 * 定义FavoriteTopicSchema 的 pre-hooks
 * @author heroic
 */

/** Exports hooks */
module.exports = exports = function(schema) {
  // 收藏某个话题时会做以下操作
  schema
    .pre('save', true, function(next, done) {
      next();
      // 增加对应用户的话题收藏数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          favoriteTopicCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 增加对应话题的被收藏数量
      var Topic = this.model('Topic');
      Topic.findByIdAndUpdate(this.topicId, {
        $inc: {
          favoriteCount: 1
        }
      }, done);
    });

  // 取消收藏某个话题时会做以下操作
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 减少对应用户的话题收藏数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          favoriteTopicCount: -1
        }
      }, done);
    })
    .pre('remove', true, function(next, done) {
      next();
      // 减少对应话题的被收藏数量
      var Topic = this.model('Topic');
      Topic.findByIdAndUpdate(this.topicId, {
        $inc: {
          favoriteCount: -1
        }
      }, done);
    });
};