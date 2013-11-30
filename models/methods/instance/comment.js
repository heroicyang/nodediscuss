/**
 * Comment 实例方法
 * @author heroic
 */

/**
 * 标识该条评论为已删除
 * @param  {Function} callback
 */
exports.destroy = function(callback) {
  this.update({
    deleted: true
  }, callback);
};