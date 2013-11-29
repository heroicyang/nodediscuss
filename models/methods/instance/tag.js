/**
 * Tag 实例方法
 * @author heroic
 */

/**
* 检查该节点是否被某个用户收藏
* @param  {String}   userId   用户 id
* @param  {Function} callback
*  - err
*  - favorited    true: 收藏, false: 未收藏
*/
exports.isFavoritedBy = function(userId, callback) {
  var FavoriteTag = this.model('FavoriteTag');
  FavoriteTag.findOne({
    userId: userId,
    'tag.id': this.id
  }, function(err, favoriteTag) {
    callback(err, !!favoriteTag);
  });
};