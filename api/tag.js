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

/**
 * 根据查询条件获取节点
 * @param  {Object}   options  查询选项
 *  - conditions  {Object}   查询条件，默认查询全部
 *  - notPaged    {Boolean}  是否分页，当指定为 true 时不做分页，返回符合条件的全部数据
 *  - pageIndex   {Number}   当前页数，默认为第1页
 *  - pageSize    {Number}   每页记录条数，默认20条
 *  - fields      {Object|String}  需要返回的字段，默认全部
 *  - sort        {Object}   排序条件，默认按创建时间逆序排序
 * @param  {Function} callback 回调函数
 *  - err     MongooseError
 *  - tags  节点数组
 */
exports.query = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var conditions = options.conditions,
    notPaged = typeof options.notPaged !== 'undefined' ? options.notPaged : false,
    pageIndex = options.pageIndex || 1,
    pageSize = options.pageSize || 20,
    fields = options.fields || null,
    sort = options.sort || {
      createdAt: -1
    },
    query = Tag.find().lean();

  query = query.find(conditions)
    .sort(sort);

  if (fields) {
    query = query.select(fields);
  }

  if (!notPaged) {
    query = query.skip((pageIndex - 1) * pageSize).limit(pageSize);
  }

  query.exec(callback);
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