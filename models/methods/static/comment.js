/**
 * 定义 CommentSchema 的静态方法
 * @author heroic
 */

/**
 * 删除评论，并不是物理删除，只是标记删除而已
 * @param  {String}   commentId  评论 id
 * @param  {Function} callback   回调函数
 *  - err    MongooseError
 * @return {null}
 */
exports.destroy = function(commentId, callback) {
  this.findById(commentId, function(err, comment) {
    if (err) {
      return callback(err);
    }
    comment.deleted = true;
    comment.save(callback);
  });
};