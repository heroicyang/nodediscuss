/**
 * 定义 FavoriteNodeSchema 的静态方法
 * @author heroic
 */

/**
 * 取消收藏某个节点
 * @param  {String}   userId   用户 id
 * @param  {String}   nodeId   节点 id
 * @param  {Function} callback 回调函数
 *  - err   MongooseError
 * @return {null}
 */
exports.destroy = function(userId, nodeId, callback) {
  this.findOne({
    userId: userId,
    'node.id': nodeId
  }, function(err, favoriteNode) {
    if (err) {
      return callback(err);
    }
    favoriteNode.remove(callback);
  });
};