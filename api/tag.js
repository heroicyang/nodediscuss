/**
 * 节点相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var models = require('../models'),
  Tag = models.Tag,
  FavoriteTag = models.FavoriteTag;

exports.query = function(conditions, callback) {
  var q = Tag.query(conditions);
  if (!callback) {
    return q;
  } else {
    q.execQuery(callback);
  }
};

/**
 * 根据节点 id 或节点名获取节点
 * @param  {Object}   tagData
 *  - id    节点 id
 *  - name  节点名
 * @param  {Function} callback
 *  - err     MongooseError
 *  - tag     节点对象
 */
exports.get = function(tagData, callback) {
  if (tagData.id) {
    return Tag.findById(tagData.id, callback);
  } else if (tagData.name) {
    return Tag.findOne({
      name: tagData.name
    }, callback);
  }
};

/**
 * 根据节点名查询该节点是否被某个用户收藏
 * @param  {Object}   args
 *  - name     节点名
 *  - userId   用户 id
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 *  - favorited   true: 收藏, false: 未收藏
 */
exports.isFavoritedBy = function(args, callback) {
  var name = args.name,
    userId = args.userId;
  FavoriteTag.findOne({
    userId: userId,
    'tag.name': name
  }, function(err, favoriteTag) {
    if (err) {
      return callback(err);
    }
    callback(null, !!favoriteTag);
  });
};

/**
 * 收藏节点
 * @param  {Object}   args
 *  - id       节点 id
 *  - name     节点名
 *  - userId   用户 id
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 */
exports.favorite = function(args, callback) {
  var id = args.id,
    name = args.name,
    userId = args.userId;
  FavoriteTag.create({
    userId: userId,
    tag: {
      id: id,
      name: name
    }
  }, function(err) {
    callback(err);
  });
};

/**
 * 取消节点收藏
 * @param  {Object}   args
 *  - id       节点 id
 *  - userId   用户 id
 * @param  {Function} callback 回调函数
 *  - err    MongooseError
 */
exports.removeFavorite = function(args, callback) {
  var tagId = args.id,
    userId = args.userId;
  FavoriteTag.destroy(userId, tagId, function(err) {
    callback(err);
  });
};