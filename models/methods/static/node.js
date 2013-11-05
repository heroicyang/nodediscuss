/**
 * 定义 NodeSchema 静态方法
 * @author  heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 查找所有的节点并按照类别分组
 * @param  {Function} callback  回调函数
 *  - err    MongooseError
 *  - nodes  按类别分组后的节点对象，对象的 key 为类别
 * @return {null}
 */
exports.findAllGroupedByCategory = function(callback) {
  this.find()
    .exec(function(err, nodes) {
      if (err) {
        return callback(err);
      }
      nodes = _.groupBy(nodes, function(node) {
        return node.category;
      });
      callback(null, nodes);
    });
};

/**
 * 获取最热门的节点
 * @param  {Object|Function}   limit    要取得的节点数量或者回调函数
 * @param  {Function} callback          回调函数
 *  - err    MongooseError
 *  - nodes  节点列表
 * @return {null}
 */
exports.findTopNodes = function(limit, callback) {
  if (typeof limit === 'function') {
    callback = limit;
    limit = 5;
  }

  this.find()
    .sort({
      topicCount: -1
    })
    .limit(limit)
    .exec(callback);
};