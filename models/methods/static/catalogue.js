/**
 * 定义 CatalogueSchema 静态方法
 * @author  heroic
 */

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * 查找所有的节点并按照 section 分组
 * @param  {Function} callback  回调函数
 *  - err    MongooseError
 *  - catalogues  按类别分组后的节点对象，对象的 key 为类别
 * @return {null}
 */
exports.findAllGroupedBySection = function(callback) {
  this.find()
    .exec(function(err, catalogues) {
      if (err) {
        return callback(err);
      }
      catalogues = _.groupBy(catalogues, function(catalogue) {
        return catalogue.section.name;
      });
      callback(null, catalogues);
    });
};

/**
 * 获取最热门的节点
 * @param  {Number|Function}   limit    要取得的节点数量或者回调函数
 * @param  {Function} callback          回调函数
 *  - err         MongooseError
 *  - catalogues  节点列表
 * @return {null}
 */
exports.findTops = function(limit, callback) {
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