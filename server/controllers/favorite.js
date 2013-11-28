/**
 * 用户收藏列表的逻辑控制
 * @author heroic
 */

/**
 * Module dependencies
 */
var async = require('async'),
  _ = require('lodash'),
  api = require('../../api');

exports.topicList = function(req, res, next) {
  api.favorite.queryFavoriteTopics({
    userId: req.user.id
  }, function(err, topics) {
    if (err) {
      return next(err);
    }
    req.breadcrumbs('话题收藏');
    res.render('favorite_topics', {
      topics: topics
    });
  });
};

exports.tagList = function(req, res, next) {
  async.waterfall([
    function getAllFavoriteTags(next) {
      api.favorite.tags({
        userId: req.user.id
      }, function(err, tags) {
        next(err, tags);
      });
    },
    function queryTopics(tags, next) {
      var tagIds = _.pluck(tags, 'id');
      api.topic.query({
        conditions: {
          'tag.id': { $in: tagIds }
        }
      }, function(err, topics) {
        next(err, {
          tags: tags,
          topics: topics
        });
      });
    }
  ], function(err, results) {
    if (err) {
      return next(err);
    }

    req.breadcrumbs('节点收藏');
    res.render('favorite_tags', results);
  });
};