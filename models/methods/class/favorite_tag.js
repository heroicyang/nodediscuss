/**
 * FavoriteTag 类方法
 * @author heroic
 */

/**
 * 取消收藏某个节点
 * @param  {String}   userId   用户 id
 * @param  {String}   tagId    节点 id
 * @param  {Function} callback 回调函数
 *  - err   MongooseError
 * @return {null}
 */
exports.destroy = function(userId, tagId, callback) {
  this.findOne({
    userId: userId,
    'tag.id': tagId
  }, function(err, favoriteTag) {
    if (err) {
      return callback(err);
    }
    favoriteTag.remove(callback);
  });
};