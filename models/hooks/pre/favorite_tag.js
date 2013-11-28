/**
 * 定义 FavoriteTagSchema 的 pre-hooks
 * @author heroic
 */

/** Exports hooks */
module.exports = exports = function(schema) {
  // 收藏某个节点时会做如下操作
  schema
    .pre('save', true, function(next, done) {
      next();
      // 增加对应用户的节点收藏数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          favoriteTagCount: 1
        }
      }, done);
    })
    .pre('save', true, function(next, done) {
      next();
      // 增加对应节点的被收藏数量
      var Tag = this.model('Tag');
      Tag.findByIdAndUpdate(this.tag.id, {
        $inc: {
          favoriteCount: 1
        }
      }, done);
    });

  // 取消收藏某个节点时会做如下操作
  schema
    .pre('remove', true, function(next, done) {
      next();
      // 减少对应用户的节点收藏数量
      var User = this.model('User');
      User.findByIdAndUpdate(this.userId, {
        $inc: {
          favoriteTagCount: -1
        }
      }, done);
    })
    .pre('remove', true, function(next, done) {
      next();
      // 减少对应节点的被收藏数量
      var Tag = this.model('Tag');
      Tag.findByIdAndUpdate(this.tag.id, {
        $inc: {
          favoriteCount: -1
        }
      }, done);
    });
};