/**
 * 定义 SectionSchema 的静态方法
 * @author heroic
 */

/**
 * 删除节点域
 * @param  {String}   id       
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 * @return {null}
 */
exports.destroy = function(id, callback) {
  this.findById(id, function(err, section) {
    if (err) {
      return callback(err);
    }
    section.remove(callback);
  });
};