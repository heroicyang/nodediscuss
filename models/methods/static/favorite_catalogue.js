/**
 * 定义 FavoriteCatalogueSchema 的静态方法
 * @author heroic
 */

/**
 * 取消收藏某个节点
 * @param  {String}   userId   用户 id
 * @param  {String}   catalogueId   节点 id
 * @param  {Function} callback 回调函数
 *  - err   MongooseError
 * @return {null}
 */
exports.destroy = function(userId, catalogueId, callback) {
  this.findOne({
    userId: userId,
    'catalogue.id': catalogueId
  }, function(err, favoriteNode) {
    if (err) {
      return callback(err);
    }
    favoriteNode.remove(callback);
  });
};