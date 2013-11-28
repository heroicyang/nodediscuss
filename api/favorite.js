/**
 * 用户收藏相关的 API
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  models = require('../models'),
  Topic = models.Topic,
  FavoriteTopic = models.FavoriteTopic,
  Tag = models.Tag,
  FavoriteTag = models.FavoriteTag;

/**
 * 根据查询条件获取收藏的话题
 * @param  {Object}   options  查询选项
 *  - userId      {String}   用户 id
 *  - pageIndex   {Number}   当前页数，默认为第1页
 *  - pageSize    {Number}   每页记录条数，默认20条
 *  - fields      {Object|String}  需要返回的字段，默认全部
 *  - sort        {Object}   排序条件，默认按收藏时间逆序排序
 * @param  {Function} callback 回调函数
 *  - err     MongooseError
 *  - topics  收藏的话题列表
 */
exports.queryFavoriteTopics = function(options, callback) {
  var userId = options.userId,
    pageIndex = options.pageIndex || 1,
    pageSize = options.pageSize || 20,
    fields = options.fields || null,
    sort = options.sort || {
      createdAt: -1
    };

  async.waterfall([
    function queryFavotites(next) {
      FavoriteTopic.find({
        userId: userId
      })
        .sort(sort)
        .skip((pageIndex - 1) * pageSize)
        .limit(pageSize)
        .exec(function(err, favorites) {
          next(err, favorites);
        });
    },
    function mappingTopics(favorites, next) {
      async.map(favorites, function(favorite, next) {
        Topic.findById(favorite.topicId, fields, function(err, topic) {
          next(err, topic);
        });
      }, function(err, favoriteTopics) {
        next(err, favoriteTopics);
      });
    }
  ], callback);
};