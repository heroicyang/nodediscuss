/**
 * Topic 实例方法
 * @author heroic
 */

/**
 * 检查该话题是否被某个用户收藏
 * @param  {String}   userId   用户 id
 * @param  {Function} callback
 *  - err
 *  - favorited    true: 收藏, false: 未收藏
 */
exports.isFavoritedBy = function(userId, callback) {
  var FavoriteTopic = this.model('FavoriteTopic');
  FavoriteTopic.findOne({
    userId: userId,
    topicId: this.id
  }, function(err, favoriteTopic) {
    callback(err, !!favoriteTopic);
  });
};

/**
 * 增加该话题的阅读数量
 * @param  {Function} callback
 */
exports.incViewsCount = function(callback) {
  this.update({
    $inc: {
      viewsCount: 1
    }
  }, callback);
};