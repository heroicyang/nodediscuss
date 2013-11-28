/**
 * FavoriteTopic 类方法
 * @author heroic
 */

/**
 * 取消收藏某个话题
 * @param  {String}   userId   用户 id
 * @param  {String}   topicId   话题 id
 * @param  {Function} callback 回调函数
 *  - err   MongooseError
 * @return {null}
 */
exports.destroy = function(userId, topicId, callback) {
  this.findOne({
    userId: userId,
    topicId: topicId
  }, function(err, favoriteTopic) {
    if (err) {
      return callback(err);
    }
    favoriteTopic.remove(callback);
  });
};