/**
 * Relation 的类方法
 * @author heroic
 */

/**
 * userId 用户取消对 followId 用户的关注
 * @param  {String}   userId    用户 id
 * @param  {String}   followId  被关注用户的 id
 * @param  {Function} callback
 *  - err    MongooseError
 */
exports.destroy = function(userId, followId, callback) {
  this.findOne({
    userId: userId,
    followId: followId
  }, function(err, relation) {
    if (err) {
      return callback(err);
    }
    if (!relation) {
      return callback(null);
    }
    relation.remove(callback);
  });
};